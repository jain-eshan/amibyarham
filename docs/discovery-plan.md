# Jewelry Discovery Catalog + Taste Recommendation Engine

## Context

AMI by Arham is a discovery-led lead-gen site for bespoke lab-grown diamond jewelry. The
core conversion mechanic already exists: **Path B `/discover`** — a Tinder-style swipe deck
(`SwipeEngine.tsx`) that reads a flat `inspiration_images` table and lets users save favorites
into a `swipe_board` request. Today the deck is dumb: order is `created_at desc`, there are no
attributes, no learning, and the catalog is tiny/admin-curated by hand.

The goal is to turn this into the **main discovery engine**: a large, attribute-rich catalog of
jewelry inspiration (scraped from Pinterest/Danish design sites + our own pieces), shown in a
swipe flow that **learns the user's taste in real time** and re-ranks what it shows next, then
converts that taste into a high-intent commission lead. We are not building ML from scratch — we
use open-source CLIP for image fingerprints, `pgvector` (built into Supabase) for similarity, and
later n8n for automated ingestion.

### Decisions locked with the user
- **Sourcing:** scrape & show as inspiration, but behind a **review + attribution gate** (every
  scraped image lands `pending_review`, carries `source_url`/`attribution`, only `approved` rows
  go live) to reduce IP/ToS exposure. *Engineering/legal note: scraping creator-owned images for
  commercial display is legally risky; the review gate, attribution, and a "saved as inspiration,
  remade as an original AMI piece" framing are mitigations, not full protection — surface to a
  lawyer before public launch.*
- **ML infra:** **hybrid self-host CLIP** — embeddings + zero-shot tags computed once per image on
  a CPU worker next to n8n. ~$0 ongoing, no GPU, full control over scraped-image data. **Runtime
  swipes need zero inference** — taste is vector math over stored embeddings; `pgvector` does the
  search.
- **Scope of this build:** Phase 1 (enriched catalog) **+** Phase 2 (live embedding-based
  re-ranking) together. Phase 3 (automated n8n ingestion) is documented here but built next.

---

## Architecture at a glance

```
Ingestion (Phase 3, n8n)        Storage / Brain (Supabase)         Runtime (Next.js)
─────────────────────────       ──────────────────────────         ─────────────────
sources → download → phash      inspiration_images (enriched       /discover SwipeEngine
  dedup → upload to Storage  →   + attrs + embedding vector +   →   ├─ logs swipe_events
  → CLIP worker: embed+tag       status gate) + pgvector index      ├─ after N swipes calls
  → insert pending_review        swipe_events (per-card log)        │   /api/recommend
                                 match_inspiration() RPC            └─ splices re-ranked tail
```

**Key reframe:** inference is one-time per image at ingestion. A swipe = one `pgvector` query.

---

## Phase 1 — Enriched catalog schema + attributes

### New migration: `supabase/migrations/0003_discovery_catalog.sql`
- `create extension if not exists vector;`
- Add `custom_request_status`-style enum `inspiration_status` = `pending_review | approved | rejected`.
- **Extend `inspiration_images`** (additive, backward compatible):
  - `style_tags text[]`, `metal text[]`, `stones text[]`, `motif text[]`, `occasion text[]`
  - `source_name text`, `source_url text`, `attribution text`, `license_status text default 'unknown'`
  - `phash text` (perceptual hash) + `unique` index for dedup
  - `is_own_catalog boolean not null default false`
  - `status public.inspiration_status not null default 'approved'` (existing rows stay `approved`;
    scraped inserts default `pending_review` — set explicitly by the pipeline)
  - `embedding vector(512)` (open_clip **ViT-B/32** = 512-dim, CPU-friendly)
  - `featured boolean default false` (drives cold-start diversity)
- Indexes: `hnsw (embedding vector_cosine_ops)`, btree on `status`, gin on `style_tags`.
- **RLS:** tighten public select to `status = 'approved'` only (keep admin full access).
- **New table `swipe_events`**: `id uuid pk`, `session_id uuid not null`, `image_id uuid null
  references inspiration_images`, `decision text check (decision in ('like','pass'))`,
  `position int`, `created_at`. RLS: anon `insert`, authenticated `select` (mirrors
  `request_favorite_items` conventions in `0001_initial_schema.sql`).

### Modify `ami-app/src/types/database.ts`
- Add the new columns to `inspiration_images` Row/Insert/Update, the `inspiration_status` enum,
  and the `swipe_events` table + aliases. Keep the existing `InspirationImage` alias working.

### Modify `ami-app/src/lib/inspiration.ts`
- `getInspirationDeck()`: filter `.eq("status","approved")`; select the new attribute + embedding
  columns; **cold-start ordering** = featured/own-catalog + category-diverse shuffle for the first
  cards (so the opening deck is broad before we know taste). Fallback deck unchanged.
- Extend `InspirationItem` with optional `styleTags`, `metal`, `sourceUrl`, `attribution` (for
  caption display + later explainability). `embedding` stays server-side only (not shipped to client).

### Admin review (don't over-build)
- **Use Supabase Studio** as the Phase-1 review queue: filter `status = 'pending_review'`, eyeball
  the image + auto-tags, edit, flip to `approved`. No custom admin UI yet. Revisit a thin `/admin`
  page only once volume demands it.

**Phase 1 ships value immediately:** richer captions, a quality gate, and a catalog that can grow
beyond hand-curation — even before the recommender is wired.

---

## Phase 2 — Live taste recommendation (built now, with Phase 1)

### Embedding backfill for the manual catalog
- `clip-worker/` (self-hosted, documented infra): tiny **Python FastAPI** service exposing
  `POST /embed` (open_clip ViT-B/32 image → 512-vector) and `POST /tag` (zero-shot CLIP against a
  jewelry label set: category, metal, style, stone, motif, occasion). CPU-only; `Dockerfile` +
  `docker-compose.yml` so it sits next to n8n. ~0.1–0.5s/image batch.
- `scripts/backfill-embeddings.ts` (run with `tsx`): pulls approved rows lacking `embedding`,
  fetches each image, calls the worker `/embed` (+ `/tag` for any untagged), writes back via the
  Supabase service-role client. One-off + re-runnable.

### Recommendation RPC: in `0003_discovery_catalog.sql`
- `match_inspiration(query vector(512), exclude uuid[], match_limit int)` →
  `setof inspiration_images` where `status='approved'` and `id <> all(exclude)`,
  `order by embedding <=> query limit match_limit`. (Heavy ANN search stays in pgvector.)

### API route: `ami-app/src/app/api/recommend/route.ts`
- `POST { sessionId, likedIds[], dislikedIds[], seenIds[], limit }`.
- Server (service-role) fetches embeddings for liked/disliked, computes the **taste vector** in JS:
  `mean(liked) − 0.4 * mean(disliked)` (skip disliked term until ≥1 like). Calls `match_inspiration`
  with `exclude = seenIds`. Returns ranked unseen cards (no embedding in payload).
- Cold-start / fallback: if `likedIds` empty or no embeddings exist, return `[]` → SwipeEngine keeps
  the diverse server-ordered deck. Robust when the catalog has no vectors yet.

### Modify `ami-app/src/app/discover/SwipeEngine.tsx`
- Generate a `sessionId` (`crypto.randomUUID()`) once on mount.
- In `commit()`, fire-and-forget log each decision to a thin `/api/swipe-event` (or batch every few)
  → `swipe_events`. Non-blocking; never interrupts the optimistic swipe.
- After a threshold (e.g. **5 swipes** with ≥1 like), call `/api/recommend` with accumulated
  liked/disliked/seen ids; **splice** the returned ranked items into `deck[index+1 …]`, de-duping
  against already-seen ids. Re-fetch periodically (e.g. every ~5 further swipes) so ranking adapts.
- All current behavior (favorites, undo, history, review board, `swipe_board` submission) is
  untouched — re-ranking only reorders upcoming cards.

**Why this is the right engine:** content-based, cold-start-friendly, explainable (we can later say
"you love minimal gold studs" from tags), zero per-user inference cost, and it reuses the swipe UX
that already converts.

---

## Phase 3 — Automated ingestion via n8n (documented, built next)

`docs/ingestion-n8n.md` describes the scraping pipeline. **Three source lanes, legitimate-first,
all converging on one `pending_review` queue — nothing auto-publishes.**

### Lane A — Pinterest (curation-driven, not blind search-scraping)
Pinterest API v5 only exposes boards **you own**, so we lean on that as the compliant primary path:
- Team curates themed boards on an AMI Pinterest account ("minimal gold studs", "polki chokers",
  "emerald-cut solitaires") — doubles as human taste curation.
- n8n pulls pins from those boards via the official API.
- Fallback for broader reach: `gallery-dl` (open source) on public boards with a logged-in cookie —
  higher ToS risk, used sparingly, always behind the review gate.

### Lane B — Danish/Scandinavian brand catalogs (structured crawl)
Brands: Pernille Corydon, Maria Black, Sophie Bille Brahe, Georg Jensen, Trine Tuxen, Kinraden,
Julie Sandlau. These expose **schema.org `Product` JSON-LD** per product page → extract clean
structured data (name, image, `material`, `category`, brand) rather than guessing from pixels.
Respect `robots.txt`, throttle, real User-Agent. Tooling: Scrapy/Playwright or n8n HTTP + HTML
Extract nodes; seed from each brand's sitemap → product URLs.

### Lane C — Licensed stock (Unsplash/Pexels APIs)
Free commercial license, fully clean. Smaller jewelry selection — used for diversity/filler.

### What we extract per image
`image binary + URL`, `source_url` (pin/product/photo page), `source_name` + `attribution`
(board+pinner / brand / photographer), `alt_text`/title, native category & material, and a
per-lane `license_status` (`unknown` / `editorial` / `licensed`). Our enrichment then adds `phash`,
CLIP `embedding`, and zero-shot tags (`metal`, `style_tags`, `stones`, `motif`, `occasion`).

### Workflow (per lane)
1. **Seed**: Lane A = API/board pins; Lane B = sitemap → product URLs; Lane C = stock API query.
2. **Fetch**: download image (Lane B also parses JSON-LD); skip on exact-URL match.
3. **Dedup**: `imagehash` pHash + exact URL — collapse the same piece from multiple sources.
4. **Upload** to Supabase Storage `inspiration-images`.
5. **Enrich**: CLIP worker `/embed` + `/tag`; map brand `material` → `metal`/`stones`.
6. **Insert** via Supabase REST with `status='pending_review'`, full provenance, embedding, tags.
7. **Approve**: human flips to `approved` in Supabase Studio → row goes live in `/discover`.

### Politeness / legal posture
Respect `robots.txt`, rate-limit, real User-Agent, store provenance on every row. Lane A-via-API and
Lane C are clean; Lane A-via-`gallery-dl` and Lane B images are creator/brand-owned — review gate +
attribution + "remade as an original AMI piece" framing are mitigations, not immunity. **Lawyer
sign-off before public launch.**

---

## Files to create / modify

**Create**
- `supabase/migrations/0003_discovery_catalog.sql` — vector ext, enriched columns, status enum,
  indexes, RLS tightening, `swipe_events`, `match_inspiration()` RPC.
- `ami-app/src/app/api/recommend/route.ts` — taste-vector + pgvector recommendation endpoint.
- `ami-app/src/app/api/swipe-event/route.ts` — thin swipe-event logger.
- `scripts/backfill-embeddings.ts` — one-off embedding/tag backfill via the CLIP worker.
- `clip-worker/` — FastAPI `app.py`, `Dockerfile`, `docker-compose.yml` (embed + zero-shot tag).
- `docs/ingestion-n8n.md` — Phase 3 pipeline doc.

**Modify**
- `ami-app/src/types/database.ts` — new columns, enum, `swipe_events`, aliases.
- `ami-app/src/lib/inspiration.ts` — status filter, attribute select, cold-start ordering, extended
  `InspirationItem`.
- `ami-app/src/app/discover/SwipeEngine.tsx` — sessionId, event logging, incremental re-rank splice.
- `ami-app/src/lib/supabase.ts` — add a **service-role** server client factory (used only by the API
  routes / backfill, never shipped to the browser) if one isn't already present.

**Reuse**
- `getInspirationDeck()` / `InspirationItem` (`lib/inspiration.ts`), supabase client factories
  (`lib/supabase.ts`), migration + RLS conventions from `0001_initial_schema.sql`, the existing
  `swipe_board` submission path in `SwipeEngine.tsx`.

---

## Verification
1. **Migration**: apply `0003` to a Supabase branch; confirm `vector` extension, new columns, HNSW
   index, and `match_inspiration` exist (`select * from pg_extension`, `\d inspiration_images`).
2. **Backfill**: run the CLIP worker (`docker compose up`), then `tsx scripts/backfill-embeddings.ts`;
   verify `embedding is not null` count matches approved rows and tags populated.
3. **Recommender API**: `curl POST /api/recommend` with a few liked ids → returns ranked unseen
   approved cards; empty liked → `[]` (cold-start path).
4. **End-to-end UX**: `npm run dev`, open `/discover`, swipe ≥5 with some likes → confirm (a)
   `swipe_events` rows appear, (b) subsequent cards visibly shift toward the liked style, (c)
   favorites/undo/board submission still work, (d) empty/no-embedding catalog falls back to the
   diverse deck without errors.
5. **Gate**: insert a `pending_review` row → confirm it does **not** appear in `/discover`; flip to
   `approved` in Studio → it appears.
6. `npm run lint && npm run typecheck` clean.
