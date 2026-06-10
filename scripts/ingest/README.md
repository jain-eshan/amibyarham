# Phase 3 ingestion pipeline

Scriptable implementation of the ingestion design in
[`docs/ingestion-n8n.md`](../../docs/ingestion-n8n.md). Collects jewelry
inspiration from source lanes, enriches it via the CLIP worker, and inserts
**`pending_review`** rows for human approval in Supabase Studio. Nothing
auto-publishes.

## Layout

```
ingest/
  types.ts          SourceCandidate + EnrichResult shapes (lane contract)
  clients.ts        Supabase service-role client, polite fetch, worker /enrich
  material-map.ts   native material/category string → metals/stones facets
  pipeline.ts       shared flow: dedup → download → enrich → upload → insert
  lanes/
    danish.ts       Lane B — Danish brand schema.org Product JSON-LD crawl
  run.ts            CLI entrypoint
```

Adding a lane = write a collector that returns `SourceCandidate[]` and wire it
into `run.ts`. The pipeline handles everything downstream.

## Prerequisites

1. Migrations `0004` + `0005` applied (enriched schema + RPC).
2. CLIP worker running (`cd clip-worker && docker compose up`).
3. `npm install` in this `scripts/` directory.

## Run

```bash
cd scripts
npm install

SUPABASE_URL=https://YOUR-PROJECT.supabase.co \
SUPABASE_SERVICE_ROLE_KEY=... \
CLIP_WORKER_URL=http://localhost:8000 \
npm run ingest -- danish --brand "Maria Black" --max-products 20

# Preview without writing anything:
npm run ingest -- danish --dry-run --max-products 5
```

### Flags

| Flag             | Meaning                                              |
| ---------------- | ---------------------------------------------------- |
| `--brand NAME`   | Restrict Lane B to one brand                         |
| `--max-products` | Product pages crawled per brand (default 25)         |
| `--limit N`      | Cap rows actually inserted this run                  |
| `--dry-run`      | Log candidates, write nothing                        |

### Env

| Var                         | Purpose                                            |
| --------------------------- | -------------------------------------------------- |
| `SUPABASE_URL`              | Project URL                                        |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role — bypasses RLS for insert/upload      |
| `CLIP_WORKER_URL`           | Worker base URL (default `http://localhost:8000`)  |
| `INGEST_DELAY_MS`           | Per-request throttle (default 1200ms)              |
| `INGEST_USER_AGENT`         | Override the bot User-Agent                        |

## Politeness / legal

Real User-Agent, throttled, provenance stored on every row. **Check each
brand's `robots.txt` and ToS before enabling a real crawl** — the brand list
in `lanes/danish.ts` is a starting point, not clearance. Brand imagery is
creator-owned; the review gate + attribution + "remade as an original AMI
piece" framing are mitigations, not immunity. Lawyer sign-off before public
launch.

## Lanes A (Pinterest) and C (stock)

Documented in `docs/ingestion-n8n.md`; both need credentials (Pinterest OAuth /
Unsplash-Pexels API keys) so they scaffold next. They'll drop in as new
collectors under `lanes/` producing the same `SourceCandidate[]`.
