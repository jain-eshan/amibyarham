"""
scripts/pinterest_sync.py — Phase 3, Lane A
Pinterest API v5 → Supabase `inspiration_images` ingestion pipeline.

Pipeline stages (per pin):
  1. Refresh OAuth token (refresh_token grant)
  2. Fetch user's boards → paginate all pins per board
  3. Three-tier tag cascade: board name → text regex → CLIP worker
  4. Dedup by source_url (then phash after download)
  5. Upload image binary to Supabase Storage
  6. Insert pending_review row with full provenance, embedding, merged tags

Usage:
    pip install requests python-dotenv supabase
    python scripts/pinterest_sync.py [--dry-run] [--limit N]

Required .env variables: see .env.pinterest.example at the bottom of this file.
"""

from __future__ import annotations

import argparse
import base64
import io
import json
import logging
import os
import re
import sys
import time
import uuid
from dataclasses import dataclass, field
from typing import Any

import requests
from dotenv import load_dotenv
from supabase import create_client, Client

# ---------------------------------------------------------------------------
# Logging
# ---------------------------------------------------------------------------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("pinterest_sync")

# ---------------------------------------------------------------------------
# Constants
# ---------------------------------------------------------------------------
PINTEREST_TOKEN_URL = "https://api.pinterest.com/v5/oauth/token"
PINTEREST_API_BASE  = "https://api.pinterest.com/v5"
CLIP_WORKER_BASE    = os.getenv("CLIP_WORKER_URL", "http://localhost:8000")
STORAGE_BUCKET      = "inspiration-images"
REQUEST_DELAY_S     = 0.6   # polite inter-request pause
MAX_RETRIES         = 4     # for 429 / transient errors
USER_AGENT          = "AMIByArhamBot/1.0 (+https://amibyarham.com)"


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------
@dataclass
class TagSet:
    """Merged taxonomy tags that map directly onto inspiration_images columns."""
    jewelry_type: str | None         = None
    metals:       list[str]          = field(default_factory=list)
    stones:       list[str]          = field(default_factory=list)
    styles:       list[str]          = field(default_factory=list)
    motif:        list[str]          = field(default_factory=list)
    occasions:    list[str]          = field(default_factory=list)

    def merge_from(self, other: "TagSet") -> None:
        """Fill any empty fields from `other`; never overwrite existing values."""
        if not self.jewelry_type and other.jewelry_type:
            self.jewelry_type = other.jewelry_type
        for attr in ("metals", "stones", "styles", "motif", "occasions"):
            existing = getattr(self, attr)
            incoming = getattr(other, attr)
            merged = list(dict.fromkeys(existing + [v for v in incoming if v not in existing]))
            setattr(self, attr, merged)


@dataclass
class PinRecord:
    image_url:   str
    source_url:  str
    board_name:  str
    title:       str
    description: str


@dataclass
class IngestStats:
    seen:             int = 0
    inserted:         int = 0
    skipped_duplicate: int = 0
    failed:           int = 0


# ---------------------------------------------------------------------------
# Step 1 — OAuth token refresh
# ---------------------------------------------------------------------------

def refresh_access_token(app_id: str, app_secret: str, refresh_token: str) -> str:
    """Exchange a refresh_token for a fresh access_token via Pinterest OAuth v5."""
    credentials = base64.b64encode(f"{app_id}:{app_secret}".encode()).decode()
    resp = requests.post(
        PINTEREST_TOKEN_URL,
        headers={
            "Authorization": f"Basic {credentials}",
            "Content-Type": "application/x-www-form-urlencoded",
        },
        data={
            "grant_type": "refresh_token",
            "refresh_token": refresh_token,
        },
        timeout=15,
    )
    resp.raise_for_status()
    token = resp.json().get("access_token")
    if not token:
        raise RuntimeError(f"No access_token in Pinterest response: {resp.text}")
    log.info("Pinterest access token refreshed.")
    return token


# ---------------------------------------------------------------------------
# Step 2 — Board + pin fetching with pagination
# ---------------------------------------------------------------------------

def _pinterest_get(path: str, token: str, params: dict | None = None) -> dict:
    """GET https://api.pinterest.com/v5/<path> with retry on 429."""
    url = f"{PINTEREST_API_BASE}/{path.lstrip('/')}"
    headers = {
        "Authorization": f"Bearer {token}",
        "User-Agent": USER_AGENT,
    }
    for attempt in range(1, MAX_RETRIES + 1):
        resp = requests.get(url, headers=headers, params=params or {}, timeout=20)
        if resp.status_code == 429:
            wait = 2 ** attempt
            log.warning("Rate limited (429). Waiting %ds (attempt %d/%d).", wait, attempt, MAX_RETRIES)
            time.sleep(wait)
            continue
        resp.raise_for_status()
        return resp.json()
    raise RuntimeError(f"Exhausted retries for GET {url}")


def fetch_boards(token: str) -> list[dict]:
    """Return all boards for the authenticated user."""
    boards: list[dict] = []
    bookmark: str | None = None
    while True:
        params: dict[str, Any] = {"page_size": 25}
        if bookmark:
            params["bookmark"] = bookmark
        data = _pinterest_get("/boards", token, params)
        boards.extend(data.get("items", []))
        bookmark = data.get("bookmark")
        if not bookmark:
            break
        time.sleep(REQUEST_DELAY_S)
    log.info("Fetched %d boards.", len(boards))
    return boards


def fetch_pins_for_board(board_id: str, token: str) -> list[PinRecord]:
    """Paginate all pins in a board; extract fields needed for the pipeline."""
    pins: list[PinRecord] = []
    bookmark: str | None = None

    # We need the board name for Tier-1 tagging — fetch it once.
    board_data = _pinterest_get(f"/boards/{board_id}", token)
    board_name = board_data.get("name", "")

    while True:
        params: dict[str, Any] = {"page_size": 100}
        if bookmark:
            params["bookmark"] = bookmark
        data = _pinterest_get(f"/boards/{board_id}/pins", token, params)
        for item in data.get("items", []):
            image_url = _extract_image_url(item)
            if not image_url:
                continue
            pin_url = f"https://www.pinterest.com/pin/{item.get('id', '')}/"
            pins.append(PinRecord(
                image_url=image_url,
                source_url=pin_url,
                board_name=board_name,
                title=item.get("title") or "",
                description=item.get("description") or "",
            ))
        bookmark = data.get("bookmark")
        if not bookmark:
            break
        time.sleep(REQUEST_DELAY_S)

    log.info("Board '%s': fetched %d pins.", board_name, len(pins))
    return pins


def _extract_image_url(pin: dict) -> str | None:
    """Navigate media.images dict to get the highest-res URL available."""
    images = (pin.get("media") or {}).get("images") or {}
    for key in ("originals", "1200x", "736x", "600x", "400x"):
        entry = images.get(key)
        if entry and entry.get("url"):
            return entry["url"]
    return None


# ---------------------------------------------------------------------------
# Step 3 — Three-tier categorisation cascade
# ---------------------------------------------------------------------------

# ── Tier 1: Board-name → baseline tags ─────────────────────────────────────

_BOARD_JEWELRY_TYPE: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\bearing|stud|hoop|chandbali|jhumk", re.I), "Earrings"),
    (re.compile(r"\bnecklace|pendant|choker|chain\b",   re.I), "Necklace"),
    (re.compile(r"\bbracelet|bangle|cuff\b",            re.I), "Bracelet"),
    (re.compile(r"\btikka|maang\b",                     re.I), "Maang Tikka"),
    (re.compile(r"\bbridal\s*set|\bset\b",              re.I), "Set"),
    (re.compile(r"\bring\b",                            re.I), "Ring"),
]

_BOARD_METALS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"rose\s*gold|pink\s*gold", re.I), "Rose Gold"),
    (re.compile(r"white\s*gold",            re.I), "White Gold"),
    (re.compile(r"22\s*k|22\s*karat",       re.I), "22k Gold"),
    (re.compile(r"18\s*k|18\s*karat",       re.I), "18k Gold"),
    (re.compile(r"platinum",                re.I), "Platinum"),
    (re.compile(r"\bgold\b",                re.I), "18k Gold"),  # generic → default karat
    (re.compile(r"sterling\s*silver|\bsilver\b", re.I), "Sterling Silver"),
]

_BOARD_STYLES: list[tuple[re.Pattern, str]] = [
    (re.compile(r"art\s*deco",   re.I), "Art Deco"),
    (re.compile(r"minimali",     re.I), "Minimalist"),
    (re.compile(r"\bpolki\b",    re.I), "Polki"),
    (re.compile(r"\bjadau\b",    re.I), "Jadau"),
    (re.compile(r"\bmodern\b",   re.I), "Modern"),
    (re.compile(r"boho|bohemi",  re.I), "Bohemian"),
    (re.compile(r"vintage|retro",re.I), "Vintage"),
    (re.compile(r"classic",      re.I), "Classic"),
]

_BOARD_OCCASIONS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\bbridal\b|\bwedding\b", re.I), "Wedding"),
    (re.compile(r"engagement",             re.I), "Engagement"),
    (re.compile(r"everyday|daily|casual",  re.I), "Everyday"),
    (re.compile(r"statement|bold",         re.I), "Statement"),
]

_BOARD_STONES: list[tuple[re.Pattern, str]] = [
    (re.compile(r"diamond",  re.I), "Diamond"),
    (re.compile(r"emerald",  re.I), "Emerald"),
    (re.compile(r"ruby",     re.I), "Ruby"),
    (re.compile(r"sapphire", re.I), "Sapphire"),
    (re.compile(r"pearl",    re.I), "Pearl"),
    (re.compile(r"polki",    re.I), "Polki Diamond"),
]


def _apply_rules(text: str, rules: list[tuple[re.Pattern, str]]) -> list[str]:
    seen: dict[str, bool] = {}
    return [seen.setdefault(label, label) for pat, label in rules
            if pat.search(text) and label not in seen]


def tier1_board_tags(board_name: str) -> TagSet:
    tags = TagSet()
    for pat, jtype in _BOARD_JEWELRY_TYPE:
        if pat.search(board_name):
            tags.jewelry_type = jtype
            break
    tags.metals   = _apply_rules(board_name, _BOARD_METALS)
    tags.styles   = _apply_rules(board_name, _BOARD_STYLES)
    tags.occasions = _apply_rules(board_name, _BOARD_OCCASIONS)
    tags.stones   = _apply_rules(board_name, _BOARD_STONES)
    return tags


# ── Tier 2: Text token matching (title + description) ──────────────────────

_TEXT_METALS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"rose\s*gold|pink\s*gold",          re.I), "Rose Gold"),
    (re.compile(r"white\s*gold",                     re.I), "White Gold"),
    (re.compile(r"22\s*k(?:t|arat)?",               re.I), "22k Gold"),
    (re.compile(r"18\s*k(?:t|arat)?",               re.I), "18k Gold"),
    (re.compile(r"14\s*k(?:t|arat)?",               re.I), "18k Gold"),  # nearest facet
    (re.compile(r"platinum",                         re.I), "Platinum"),
    (re.compile(r"gold\s*vermeil|vermeil",           re.I), "18k Gold"),
    (re.compile(r"(?<![a-z])gold(?![a-z])",         re.I), "18k Gold"),
    (re.compile(r"sterling\s*silver|(?<![a-z])silver(?![a-z])", re.I), "Sterling Silver"),
]

_TEXT_STONES: list[tuple[re.Pattern, str]] = [
    (re.compile(r"lab[-\s]*grown\s*diamond|diamond",  re.I), "Diamond"),
    (re.compile(r"emerald",                           re.I), "Emerald"),
    (re.compile(r"ruby",                              re.I), "Ruby"),
    (re.compile(r"sapphire",                          re.I), "Sapphire"),
    (re.compile(r"pearl",                             re.I), "Pearl"),
    (re.compile(r"polki",                             re.I), "Polki Diamond"),
    (re.compile(r"uncut",                             re.I), "Uncut Diamond"),
    (re.compile(r"moissanite",                        re.I), "Moissanite"),
    (re.compile(r"turquoise",                         re.I), "Turquoise"),
    (re.compile(r"opal",                              re.I), "Opal"),
    (re.compile(r"amethyst",                          re.I), "Amethyst"),
]

_TEXT_STYLES: list[tuple[re.Pattern, str]] = [
    (re.compile(r"art\s*deco",            re.I), "Art Deco"),
    (re.compile(r"minimali(?:st|sm)?",    re.I), "Minimalist"),
    (re.compile(r"\bpolki\b",             re.I), "Polki"),
    (re.compile(r"\bjadau\b",             re.I), "Jadau"),
    (re.compile(r"\bmodern\b",            re.I), "Modern"),
    (re.compile(r"boho|bohemi",           re.I), "Bohemian"),
    (re.compile(r"vintage|retro",         re.I), "Vintage"),
    (re.compile(r"classic(?:al)?",        re.I), "Classic"),
    (re.compile(r"solitaire",             re.I), "Solitaire"),
    (re.compile(r"cluster",               re.I), "Cluster"),
    (re.compile(r"halo",                  re.I), "Halo"),
    (re.compile(r"pav[eé]",              re.I), "Pavé"),
]

_TEXT_OCCASIONS: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\bbridal\b|\bwedding\b",       re.I), "Wedding"),
    (re.compile(r"engagement",                   re.I), "Engagement"),
    (re.compile(r"everyday|daily|casual",        re.I), "Everyday"),
    (re.compile(r"statement|bold|eye[-\s]*catch", re.I), "Statement"),
    (re.compile(r"party|festive|celebration",    re.I), "Statement"),
    (re.compile(r"office|work|professional",     re.I), "Everyday"),
]

_TEXT_MOTIF: list[tuple[re.Pattern, str]] = [
    (re.compile(r"floral|flower|petal|rose(?![\s]*gold)", re.I), "Floral"),
    (re.compile(r"geometric|hexagon|triangle|octagon",    re.I), "Geometric"),
    (re.compile(r"celestial|star|moon|sun(?:burst)?",     re.I), "Celestial"),
    (re.compile(r"leaf|foliage|branch|vine",              re.I), "Botanical"),
    (re.compile(r"butterfly",                             re.I), "Butterfly"),
    (re.compile(r"snake|serpent",                         re.I), "Serpent"),
    (re.compile(r"heart",                                 re.I), "Heart"),
    (re.compile(r"infinity",                              re.I), "Infinity"),
    (re.compile(r"cross",                                 re.I), "Cross"),
    (re.compile(r"initial|letter|monogram",               re.I), "Initial"),
]

_TEXT_JEWELRY_TYPE: list[tuple[re.Pattern, str]] = [
    (re.compile(r"\bearring|stud|hoop|drop\s*earring|chandbali|jhumk", re.I), "Earrings"),
    (re.compile(r"\bnecklace|pendant|choker|\bchain\b",                 re.I), "Necklace"),
    (re.compile(r"\bbracelet|bangle|cuff\b",                            re.I), "Bracelet"),
    (re.compile(r"\btikka|maang",                                       re.I), "Maang Tikka"),
    (re.compile(r"\bbridal\s*set|\bjewellery\s*set|\bjewelry\s*set",   re.I), "Set"),
    (re.compile(r"\bring\b",                                            re.I), "Ring"),
]


def tier2_text_tags(title: str, description: str) -> TagSet:
    haystack = f"{title} {description}"
    tags = TagSet()
    for pat, jtype in _TEXT_JEWELRY_TYPE:
        if pat.search(haystack):
            tags.jewelry_type = jtype
            break
    tags.metals   = _apply_rules(haystack, _TEXT_METALS)
    tags.stones   = _apply_rules(haystack, _TEXT_STONES)
    tags.styles   = _apply_rules(haystack, _TEXT_STYLES)
    tags.occasions = _apply_rules(haystack, _TEXT_OCCASIONS)
    tags.motif    = _apply_rules(haystack, _TEXT_MOTIF)
    return tags


# ── Tier 3: CLIP worker ─────────────────────────────────────────────────────

def _clip_post(path: str, payload: dict, timeout: int = 30) -> dict:
    url = f"{CLIP_WORKER_BASE}/{path.lstrip('/')}"
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.post(url, json=payload, timeout=timeout)
            if resp.status_code == 429:
                wait = 2 ** attempt
                log.warning("CLIP worker rate-limited. Waiting %ds.", wait)
                time.sleep(wait)
                continue
            resp.raise_for_status()
            return resp.json()
        except requests.exceptions.Timeout:
            log.warning("CLIP worker timeout (attempt %d/%d).", attempt, MAX_RETRIES)
            if attempt == MAX_RETRIES:
                raise
            time.sleep(2 ** attempt)
    return {}


def tier3_clip_tags(image_bytes: bytes) -> tuple[list[float], str, TagSet]:
    """
    Returns (embedding, phash, TagSet) from the CLIP worker.
    Uses /enrich endpoint for single-call efficiency (embedding + phash + tags).
    """
    b64_image = base64.b64encode(image_bytes).decode()
    resp = _clip_post("/enrich", {"image_base64": b64_image})

    embedding: list[float] = resp.get("embedding", [])
    phash: str = resp.get("phash", "")
    tags = TagSet(
        jewelry_type=resp.get("jewelry_type"),
        metals=resp.get("metal") or [],
        styles=resp.get("styles") or [],
        stones=resp.get("stones") or [],
        motif=resp.get("motif") or [],
        occasions=resp.get("occasions") or [],
    )
    return embedding, phash, tags


# ── Merge all three tiers ───────────────────────────────────────────────────

def build_tags(pin: PinRecord, image_bytes: bytes) -> tuple[list[float], str, TagSet]:
    """
    Run the three-tier cascade, merge, and return (embedding, phash, TagSet).

    Precedence: Tier 1 (board) wins for explicit context; Tier 2 (text) fills
    gaps; Tier 3 (CLIP) fills remaining blanks with visual classification.
    Tier 1 and 2 are deterministic; CLIP handles the visual long tail.
    """
    t1 = tier1_board_tags(pin.board_name)
    t2 = tier2_text_tags(pin.title, pin.description)

    try:
        embedding, phash, t3 = tier3_clip_tags(image_bytes)
    except Exception as exc:
        log.warning("CLIP worker unavailable (%s). Proceeding with text tags only.", exc)
        embedding, phash, t3 = [], "", TagSet()

    # Merge: T1 is baseline, T2 fills gaps, T3 fills remaining gaps.
    merged = TagSet(
        jewelry_type=t1.jewelry_type or t2.jewelry_type,
        metals=list(dict.fromkeys(t1.metals + t2.metals)),
        stones=list(dict.fromkeys(t1.stones + t2.stones)),
        styles=list(dict.fromkeys(t1.styles + t2.styles)),
        motif=list(dict.fromkeys(t1.motif + t2.motif)),
        occasions=list(dict.fromkeys(t1.occasions + t2.occasions)),
    )
    merged.merge_from(t3)

    log.debug(
        "Tags for '%s': type=%s metals=%s stones=%s styles=%s",
        pin.title[:50] or pin.source_url,
        merged.jewelry_type, merged.metals, merged.stones, merged.styles,
    )
    return embedding, phash, merged


# ---------------------------------------------------------------------------
# Step 4 — Dedup, storage upload & DB insert
# ---------------------------------------------------------------------------

def source_url_exists(supabase_client: Client, source_url: str) -> bool:
    resp = (
        supabase_client.table("inspiration_images")
        .select("id")
        .eq("source_url", source_url)
        .limit(1)
        .execute()
    )
    return bool(resp.data)


def phash_exists(supabase_client: Client, phash: str) -> bool:
    if not phash:
        return False
    resp = (
        supabase_client.table("inspiration_images")
        .select("id")
        .eq("phash", phash)
        .limit(1)
        .execute()
    )
    return bool(resp.data)


def download_image(url: str) -> tuple[bytes, str]:
    """Download image; return (bytes, content_type)."""
    for attempt in range(1, MAX_RETRIES + 1):
        try:
            resp = requests.get(
                url,
                headers={"User-Agent": USER_AGENT},
                timeout=20,
                stream=True,
            )
            if resp.status_code == 429:
                wait = 2 ** attempt
                log.warning("Image download rate-limited. Waiting %ds.", wait)
                time.sleep(wait)
                continue
            resp.raise_for_status()
            content_type = resp.headers.get("content-type", "image/jpeg").split(";")[0].strip()
            return resp.content, content_type
        except requests.exceptions.Timeout:
            log.warning("Image download timeout (attempt %d/%d): %s", attempt, MAX_RETRIES, url)
            if attempt == MAX_RETRIES:
                raise
            time.sleep(2 ** attempt)
    raise RuntimeError(f"Failed to download image after {MAX_RETRIES} attempts: {url}")


def _ext_for(content_type: str) -> str:
    if "png"  in content_type: return "png"
    if "webp" in content_type: return "webp"
    if "gif"  in content_type: return "gif"
    return "jpg"


def upload_to_storage(supabase_client: Client, image_bytes: bytes,
                      phash: str, content_type: str) -> str:
    """Upload image bytes and return the public URL."""
    slug = phash if phash else uuid.uuid4().hex
    path = f"ingested/{slug}.{_ext_for(content_type)}"
    supabase_client.storage.from_(STORAGE_BUCKET).upload(
        path, image_bytes, {"content-type": content_type, "upsert": "true"}
    )
    return supabase_client.storage.from_(STORAGE_BUCKET).get_public_url(path)


def insert_row(
    supabase_client: Client,
    pin: PinRecord,
    image_url: str,
    tags: TagSet,
    embedding: list[float],
    phash: str,
    content_type: str,
) -> None:
    row: dict[str, Any] = {
        "image_url":      image_url,
        "alt_text":       pin.title or None,
        "source_name":    "Pinterest",
        "source_url":     pin.source_url,
        "attribution":    pin.board_name,
        "license_status": "unknown",
        "status":         "pending_review",
        "is_own_catalog": False,
        # Taxonomy
        "jewelry_type":   tags.jewelry_type,
        "metals":         tags.metals,
        "stones":         tags.stones,
        "styles":         tags.styles,
        "motif":          tags.motif,
        "occasions":      tags.occasions,
    }
    if phash:
        row["phash"] = phash
    if embedding:
        row["embedding"] = embedding

    supabase_client.table("inspiration_images").insert(row).execute()


# ---------------------------------------------------------------------------
# Main ingestion loop
# ---------------------------------------------------------------------------

def ingest_pins(
    pins: list[PinRecord],
    supabase_client: Client,
    dry_run: bool = False,
    limit: int | None = None,
) -> IngestStats:
    stats = IngestStats()
    cap = limit or len(pins)

    for pin in pins:
        if stats.inserted >= cap:
            log.info("Reached insert limit (%d). Stopping.", cap)
            break

        stats.seen += 1
        try:
            # ── Dedup: source URL ──────────────────────────────────────────
            if source_url_exists(supabase_client, pin.source_url):
                log.debug("Skipping (source_url exists): %s", pin.source_url)
                stats.skipped_duplicate += 1
                continue

            # ── Download ───────────────────────────────────────────────────
            image_bytes, content_type = download_image(pin.image_url)

            # ── Three-tier tags + CLIP embedding ───────────────────────────
            embedding, phash, tags = build_tags(pin, image_bytes)

            # ── Dedup: pHash ───────────────────────────────────────────────
            if phash and phash_exists(supabase_client, phash):
                log.debug("Skipping (phash exists): %s  phash=%s", pin.source_url, phash)
                stats.skipped_duplicate += 1
                continue

            if dry_run:
                log.info(
                    "[dry-run] %s | board='%s' | type=%s metals=%s stones=%s styles=%s",
                    pin.source_url, pin.board_name,
                    tags.jewelry_type, tags.metals, tags.stones, tags.styles,
                )
                stats.inserted += 1
                time.sleep(REQUEST_DELAY_S)
                continue

            # ── Upload to storage ──────────────────────────────────────────
            storage_url = upload_to_storage(supabase_client, image_bytes, phash, content_type)

            # ── Insert DB row ──────────────────────────────────────────────
            insert_row(supabase_client, pin, storage_url, tags, embedding, phash, content_type)

            stats.inserted += 1
            log.info(
                "[+] inserted: %s | board='%s' | type=%s metals=%s",
                pin.source_url, pin.board_name, tags.jewelry_type, tags.metals,
            )

        except Exception as exc:
            stats.failed += 1
            log.error("[!] %s — %s: %s", pin.source_url, type(exc).__name__, exc)

        time.sleep(REQUEST_DELAY_S)

    return stats


# ---------------------------------------------------------------------------
# CLI entry point
# ---------------------------------------------------------------------------

def main() -> None:
    parser = argparse.ArgumentParser(
        description="Sync Pinterest boards → Supabase inspiration_images (pending_review)."
    )
    parser.add_argument("--dry-run", action="store_true",
                        help="Parse and tag pins without writing to Supabase.")
    parser.add_argument("--limit", type=int, default=None,
                        help="Maximum number of new rows to insert in this run.")
    parser.add_argument("--board", type=str, default=None,
                        help="Sync only the board matching this name substring (case-insensitive).")
    args = parser.parse_args()

    # ── Load env ─────────────────────────────────────────────────────────────
    load_dotenv()
    app_id       = os.environ["PINTEREST_APP_ID"]
    app_secret   = os.environ["PINTEREST_APP_SECRET"]
    refresh_tok  = os.environ["PINTEREST_REFRESH_TOKEN"]
    supabase_url = os.environ["SUPABASE_URL"]
    supabase_key = os.environ["SUPABASE_SERVICE_ROLE_KEY"]

    # ── Auth ──────────────────────────────────────────────────────────────────
    access_token = refresh_access_token(app_id, app_secret, refresh_tok)

    # ── Supabase client (service-role: bypasses RLS, needed for insert) ───────
    sb = create_client(supabase_url, supabase_key)

    # ── Fetch boards + pins ───────────────────────────────────────────────────
    boards = fetch_boards(access_token)
    if args.board:
        boards = [b for b in boards if args.board.lower() in b.get("name", "").lower()]
        if not boards:
            log.error("No boards matched --board filter '%s'. Aborting.", args.board)
            sys.exit(1)

    all_pins: list[PinRecord] = []
    for board in boards:
        board_id   = board["id"]
        pins = fetch_pins_for_board(board_id, access_token)
        all_pins.extend(pins)
        time.sleep(REQUEST_DELAY_S)

    log.info("Total pins to process: %d", len(all_pins))

    # ── Ingest ────────────────────────────────────────────────────────────────
    stats = ingest_pins(all_pins, sb, dry_run=args.dry_run, limit=args.limit)

    log.info(
        "Done. seen=%d  inserted=%d  skipped_duplicate=%d  failed=%d",
        stats.seen, stats.inserted, stats.skipped_duplicate, stats.failed,
    )


if __name__ == "__main__":
    main()


# ---------------------------------------------------------------------------
# .env.pinterest.example  (copy to .env and fill in values)
# ---------------------------------------------------------------------------
# PINTEREST_APP_ID=your_pinterest_app_id
# PINTEREST_APP_SECRET=your_pinterest_app_secret
# PINTEREST_REFRESH_TOKEN=your_long_lived_refresh_token
#
# SUPABASE_URL=https://your-project-ref.supabase.co
# SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_never_expose_to_browser
#
# # Optional — defaults to http://localhost:8000
# CLIP_WORKER_URL=http://localhost:8000
