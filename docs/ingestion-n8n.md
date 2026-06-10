# Phase 3 — Automated ingestion

> Lays out the scraping pipeline that feeds the Phase 1 review queue
> (`inspiration_images.status = 'pending_review'`). Three source lanes,
> legitimate-first, all converging on one human-reviewed queue —
> **nothing auto-publishes**.
>
> **Implementation status:** the shared pipeline + **Lane B (Danish brand
> JSON-LD)** are built as a scriptable TS ingester in
> [`scripts/ingest/`](../scripts/ingest/README.md). Lanes A (Pinterest) and C
> (stock) are credential-gated and scaffold next as additional collectors. An
> optional n8n orchestration layer can later call the same pipeline over HTTP;
> the design below is lane-agnostic.

## Architecture

```
   ┌───────── Lane A: Pinterest ─────────┐
   │  AMI team curates themed boards →   │
   │  Pinterest API v5 (own boards) →    │
   │  (fallback) gallery-dl on public    │
   │  boards behind a logged-in cookie.  │
   └─────────────────────────────────────┘
                   │
   ┌──── Lane B: Danish brand catalogs ──┐
   │  sitemap → product URLs →           │
   │  schema.org/Product JSON-LD parse → │
   │  (image, name, material, brand)     │
   └─────────────────────────────────────┘
                   │
   ┌──── Lane C: licensed stock ─────────┐
   │  Unsplash / Pexels API query →      │
   │  CC0 / royalty-free images          │
   └─────────────────────────────────────┘
                   ▼
   pHash dedup → upload to Supabase Storage
                   ▼
   clip-worker /embed + /tag → enriched tags + 512-dim embedding
                   ▼
   INSERT inspiration_images { status='pending_review', source_url,
                               attribution, license_status, embedding,
                               style/metal/stones/motif/occasion tags }
                   ▼
   Human review in Supabase Studio → flip `status` to 'approved'
                   ▼
   Row goes live in /discover (RLS gate already in place).
```

## Lane A — Pinterest (curation-driven)

Pinterest API v5 only exposes boards **you own**. We lean on this as the
compliant primary path:

1. AMI team curates themed boards on an AMI Pinterest account
   ("minimal gold studs", "polki chokers", "emerald-cut solitaires"). The
   curation itself doubles as human taste filtering.
2. n8n's Pinterest node (or raw HTTP node + bearer token) pulls pins from
   those boards via the official API.
3. **Fallback for broader reach:** `gallery-dl` on public boards with a
   logged-in cookie — higher ToS risk, used sparingly, always behind the
   review gate.

Extract per pin: `image url`, `pin url` (`source_url`), pinner handle +
board name (`attribution`), description (`alt_text`).

## Lane B — Danish/Scandinavian brand catalogs (structured)

Target brands: Pernille Corydon, Maria Black, Sophie Bille Brahe, Georg
Jensen, Trine Tuxen, Kinraden, Julie Sandlau.

These expose **schema.org `Product` JSON-LD** per product page → extract
clean structured data (name, image, `material`, `category`, brand) rather
than guessing from pixels.

- Respect `robots.txt`, throttle (≤1 req/sec/host), real User-Agent.
- Seed from each brand's `/sitemap.xml` → product URLs.
- Tooling: Scrapy or Playwright (for JS-rendered cases), or n8n
  `HTTP Request` + `HTML Extract` nodes.
- Map brand `material` strings → our `metals` / `stones` facets via a small
  rules table.

Extract per product: `image url`, product URL (`source_url`), brand
(`source_name` + `attribution`), product name (`alt_text`),
`material`/`category` (raw → mapped facets).

## Lane C — Licensed stock (Unsplash / Pexels APIs)

Free commercial license, fully clean. Smaller jewelry selection — used for
diversity / cold-start filler.

Extract: `image url`, photo page (`source_url`), photographer
(`attribution`), `source_name='Unsplash'`/`'Pexels'`,
`license_status='licensed'`.

## Common enrichment (every lane)

After dedup + upload to Storage, every row passes through the same
enrichment step before insert:

1. **pHash** (`imagehash.phash`) for cross-source dedup.
2. **CLIP embedding** via `clip-worker` `/embed` → 512-dim vector.
3. **Zero-shot tags** via `clip-worker` `/tag` → fills `metals`, `styles`,
   `stones`, `motif`, `occasions`, and a best-guess `jewelry_type`. Brand
   structured data (Lane B) wins on conflict.
4. **Insert** via Supabase REST with `status='pending_review'`, full
   provenance, embedding, tags.

## Workflow (per lane)

1. **Seed** the URL list (API call / sitemap fetch / stock query).
2. **Fetch** the image; skip on exact-URL match.
3. **Dedup** with pHash; collapse the same piece from multiple sources.
4. **Upload** to Supabase Storage (`inspiration-images` bucket).
5. **Enrich** via the CLIP worker.
6. **Insert** the row as `pending_review`.
7. **Approve** in Supabase Studio — human eyeballs the image + auto-tags,
   edits if needed, flips `status` to `approved`. The row appears in
   `/discover` immediately (RLS gates public reads to approved rows).

## Politeness / legal posture

- Respect `robots.txt`, rate-limit (≤1 req/sec/host), real User-Agent.
- Store provenance (`source_url`, `source_name`, `attribution`,
  `license_status`) on every row.
- Lane A-via-API and Lane C are clean.
- Lane A-via-`gallery-dl` and Lane B images are creator/brand-owned —
  review gate + attribution + "saved as inspiration, remade as an original
  AMI piece" framing are **mitigations, not immunity**.
- **Lawyer sign-off before public launch.**
