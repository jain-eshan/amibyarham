"""
AMI by Arham — CLIP worker.

Tiny FastAPI service that exposes two endpoints used at *ingestion time only*:

  POST /embed { image_url | image_base64 }  → { embedding: [512 floats] }
  POST /tag   { image_url | image_base64 }  → { metal: [], styles: [], stones: [],
                                                motif: [], occasions: [],
                                                jewelry_type: str | None }

The model is open_clip ViT-B/32 (CPU-friendly, 512-dim image embeddings). Tags
are zero-shot classifications against a small curated jewelry label set —
ranked by cosine similarity to text prompts, with a per-facet threshold so we
only emit confident labels.

This runs once per scraped image (n8n calls it, backfill script calls it).
Runtime swipes never hit this service — taste is vector math over stored
embeddings.
"""

from __future__ import annotations

import base64
import io
from typing import Iterable

import numpy as np
import open_clip
import torch
from fastapi import FastAPI, HTTPException
from PIL import Image
from pydantic import BaseModel, Field
import httpx

# ─── Model bootstrap ─────────────────────────────────────────────────────────
# Forced to CPU on purpose — the discovery plan calls for a $0-ops worker.

DEVICE = "cpu"
MODEL_NAME = "ViT-B-32"
PRETRAINED = "openai"

print(f"[clip-worker] loading {MODEL_NAME}/{PRETRAINED} on {DEVICE}…")
model, _, preprocess = open_clip.create_model_and_transforms(
    MODEL_NAME, pretrained=PRETRAINED, device=DEVICE
)
model.eval()
tokenizer = open_clip.get_tokenizer(MODEL_NAME)
print("[clip-worker] ready")

# ─── Label taxonomy ──────────────────────────────────────────────────────────
# Mirrors the structured facets in inspiration_images (0003) plus the extra
# taxonomy added in 0004 (stones, motif).

JEWELRY_TYPES = ["Ring", "Necklace", "Earrings", "Bracelet", "Maang Tikka", "Set"]
METALS = ["18k Gold", "22k Gold", "Rose Gold", "White Gold", "Platinum", "Sterling Silver"]
STYLES = ["Modern", "Minimalist", "Vintage", "Statement", "Art Deco", "Polki", "Jadau"]
STONES = ["Diamond", "Emerald", "Ruby", "Sapphire", "Pearl", "Polki Diamond", "Uncut Diamond"]
MOTIFS = ["Floral", "Geometric", "Celestial", "Animal", "Paisley", "Abstract"]
OCCASIONS = ["Wedding", "Engagement", "Everyday", "Statement"]

PROMPT_PREFIX = "a photograph of jewelry — "

# Per-facet thresholds. Single-choice (jewelry_type) always returns the argmax;
# multi-choice facets only emit labels whose similarity clears the threshold,
# so we don't over-tag.
THRESHOLDS = {
    "metals": 0.29,
    "styles": 0.29,
    "stones": 0.29,
    "motif": 0.28,
    "occasions": 0.27,
}

# Never return more than this many labels per multi-choice facet.
MAX_LABELS_PER_FACET = 3

# ─── App ─────────────────────────────────────────────────────────────────────

app = FastAPI(title="ami-clip-worker", version="0.1.0")


class ImageRequest(BaseModel):
    image_url: str | None = Field(default=None)
    image_base64: str | None = Field(default=None)


class EmbedResponse(BaseModel):
    embedding: list[float]


class TagResponse(BaseModel):
    jewelry_type: str | None
    metal: list[str]
    styles: list[str]
    stones: list[str]
    motif: list[str]
    occasions: list[str]


class EnrichResponse(TagResponse):
    """Everything the ingestion pipeline needs from one image decode."""

    embedding: list[float]
    phash: str


def _load_image(req: ImageRequest) -> Image.Image:
    if req.image_url:
        try:
            r = httpx.get(req.image_url, follow_redirects=True, timeout=20.0)
            r.raise_for_status()
            return Image.open(io.BytesIO(r.content)).convert("RGB")
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(400, f"failed to fetch image: {exc}") from exc
    if req.image_base64:
        try:
            raw = base64.b64decode(req.image_base64)
            return Image.open(io.BytesIO(raw)).convert("RGB")
        except Exception as exc:  # noqa: BLE001
            raise HTTPException(400, f"failed to decode image: {exc}") from exc
    raise HTTPException(400, "provide image_url or image_base64")


@torch.inference_mode()
def _encode_image(img: Image.Image) -> torch.Tensor:
    tensor = preprocess(img).unsqueeze(0).to(DEVICE)
    feats = model.encode_image(tensor)
    feats /= feats.norm(dim=-1, keepdim=True)
    return feats  # shape (1, 512)


@torch.inference_mode()
def _encode_text(labels: Iterable[str]) -> torch.Tensor:
    prompts = [PROMPT_PREFIX + lbl.lower() for lbl in labels]
    tokens = tokenizer(prompts).to(DEVICE)
    feats = model.encode_text(tokens)
    feats /= feats.norm(dim=-1, keepdim=True)
    return feats  # shape (len(labels), 512)


# Pre-encode every label set once at startup so /tag is just a matmul.
_LABEL_CACHE: dict[str, tuple[list[str], torch.Tensor]] = {}
for name, labels in [
    ("jewelry_type", JEWELRY_TYPES),
    ("metals", METALS),
    ("styles", STYLES),
    ("stones", STONES),
    ("motif", MOTIFS),
    ("occasions", OCCASIONS),
]:
    _LABEL_CACHE[name] = (list(labels), _encode_text(labels))


def _score(image_feat: torch.Tensor, facet: str) -> list[tuple[str, float]]:
    labels, text_feats = _LABEL_CACHE[facet]
    sims = (image_feat @ text_feats.T).squeeze(0).tolist()
    return list(zip(labels, sims, strict=False))


def _argmax(scores: list[tuple[str, float]]) -> str | None:
    if not scores:
        return None
    return max(scores, key=lambda kv: kv[1])[0]


def _above(scores: list[tuple[str, float]], threshold: float) -> list[str]:
    passing = [(label, score) for label, score in scores if score >= threshold]
    passing.sort(key=lambda kv: kv[1], reverse=True)
    return [label for label, _ in passing[:MAX_LABELS_PER_FACET]]


def _build_tags(feat: torch.Tensor) -> dict[str, object]:
    """Shared between /tag and /enrich so the taxonomy stays in one place."""
    return {
        "jewelry_type": _argmax(_score(feat, "jewelry_type")),
        "metal": _above(_score(feat, "metals"), THRESHOLDS["metals"]),
        "styles": _above(_score(feat, "styles"), THRESHOLDS["styles"]),
        "stones": _above(_score(feat, "stones"), THRESHOLDS["stones"]),
        "motif": _above(_score(feat, "motif"), THRESHOLDS["motif"]),
        "occasions": _above(_score(feat, "occasions"), THRESHOLDS["occasions"]),
    }


# ─── Perceptual hash (numpy-only DCT pHash) ──────────────────────────────────
# Self-contained so the worker carries no scipy/imagehash dependency. The hash
# is internally consistent — all we need for cross-source dedup — even if it
# isn't bit-identical to the canonical imagehash output.

_HASH_SIZE = 8
_HIGHFREQ_FACTOR = 4


def _dct_matrix(n: int) -> np.ndarray:
    k = np.arange(n)
    return np.cos(np.pi / n * (k + 0.5) * k.reshape((n, 1)))


_DCT_M = _dct_matrix(_HASH_SIZE * _HIGHFREQ_FACTOR)


def _phash(img: Image.Image) -> str:
    size = _HASH_SIZE * _HIGHFREQ_FACTOR
    grey = img.convert("L").resize((size, size), Image.Resampling.LANCZOS)
    pixels = np.asarray(grey, dtype=np.float64)
    dct = _DCT_M @ pixels @ _DCT_M.T
    low = dct[:_HASH_SIZE, :_HASH_SIZE]
    diff = low > np.median(low)
    bits = diff.flatten()
    value = 0
    for bit in bits:
        value = (value << 1) | int(bit)
    return f"{value:016x}"


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.get("/healthz")
def healthz() -> dict[str, str]:
    return {"status": "ok", "model": f"{MODEL_NAME}/{PRETRAINED}"}


@app.post("/embed", response_model=EmbedResponse)
def embed(req: ImageRequest) -> EmbedResponse:
    img = _load_image(req)
    feat = _encode_image(img).squeeze(0).tolist()
    return EmbedResponse(embedding=feat)


@app.post("/tag", response_model=TagResponse)
def tag(req: ImageRequest) -> TagResponse:
    img = _load_image(req)
    feat = _encode_image(img)
    return TagResponse(**_build_tags(feat))


@app.post("/enrich", response_model=EnrichResponse)
def enrich(req: ImageRequest) -> EnrichResponse:
    """One decode → embedding + pHash + zero-shot tags. Used by the ingester."""
    img = _load_image(req)
    feat = _encode_image(img)
    return EnrichResponse(
        embedding=feat.squeeze(0).tolist(),
        phash=_phash(img),
        **_build_tags(feat),
    )
