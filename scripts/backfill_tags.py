"""
scripts/backfill_tags.py — Re-tag existing inspiration_images rows via CLIP worker.

Fetches each row's image_url, calls the CLIP /tag endpoint, and updates
metals, stones, styles, motif, occasions, jewelry_type in the database.
Only overwrites fields that are currently empty — existing text-tag values
are preserved.

Usage:
    python scripts/backfill_tags.py [--dry-run] [--source Pinterest]
"""

from __future__ import annotations

import argparse
import logging
import os
import time

import requests
from dotenv import load_dotenv
from supabase import create_client

load_dotenv()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)-7s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("backfill_tags")

CLIP_WORKER_BASE = os.getenv("CLIP_WORKER_URL", "http://localhost:8000")
REQUEST_DELAY_S = 0.3


def clip_tag(image_url: str) -> dict:
    resp = requests.post(
        f"{CLIP_WORKER_BASE}/tag",
        json={"image_url": image_url},
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--dry-run", action="store_true")
    parser.add_argument("--source", default=None, help="Filter by source_name (e.g. Pinterest)")
    args = parser.parse_args()

    supabase = create_client(
        os.environ["SUPABASE_URL"],
        os.environ["SUPABASE_SERVICE_ROLE_KEY"],
    )

    query = (
        supabase.table("inspiration_images")
        .select("id, image_url, source_name, jewelry_type, metals, stones, styles, motif, occasions")
        .eq("status", "approved")
    )
    if args.source:
        query = query.eq("source_name", args.source)

    rows = query.execute().data
    log.info("Found %d rows to backfill", len(rows))

    updated = skipped = failed = 0

    for row in rows:
        image_url = row.get("image_url")
        if not image_url:
            log.warning("Row %s has no image_url, skipping", row["id"])
            skipped += 1
            continue

        try:
            tags = clip_tag(image_url)
        except Exception as exc:
            log.warning("CLIP failed for %s: %s", row["id"], exc)
            failed += 1
            continue

        # Build update dict — only fill fields that are currently empty.
        patch: dict = {}
        if not row.get("jewelry_type") and tags.get("jewelry_type"):
            patch["jewelry_type"] = tags["jewelry_type"]
        if not row.get("metals") and tags.get("metal"):
            patch["metals"] = tags["metal"]
        if not row.get("stones") and tags.get("stones"):
            patch["stones"] = tags["stones"]
        if not row.get("styles") and tags.get("styles"):
            patch["styles"] = tags["styles"]
        if not row.get("motif") and tags.get("motif"):
            patch["motif"] = tags["motif"]
        if not row.get("occasions") and tags.get("occasions"):
            patch["occasions"] = tags["occasions"]

        if not patch:
            log.info("Row %s already fully tagged, skipping", row["id"])
            skipped += 1
            time.sleep(REQUEST_DELAY_S)
            continue

        log.info(
            "Row %s (%s): patching %s",
            row["id"][:8],
            row.get("source_name", "?"),
            list(patch.keys()),
        )

        if not args.dry_run:
            supabase.table("inspiration_images").update(patch).eq("id", row["id"]).execute()
            updated += 1
        else:
            log.info("  [dry-run] would patch: %s", patch)
            updated += 1

        time.sleep(REQUEST_DELAY_S)

    log.info("Done. updated=%d  skipped=%d  failed=%d", updated, skipped, failed)


if __name__ == "__main__":
    main()
