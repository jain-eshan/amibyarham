# CLIP worker

CPU-only FastAPI service that produces 512-dim image embeddings and zero-shot
jewelry tags for `inspiration_images`. Used at ingestion time only — runtime
swipes never call it.

## Run locally

```bash
docker compose up --build       # builds image, downloads ViT-B/32 weights
curl http://localhost:8000/healthz
```

## Endpoints

```
POST /embed   { image_url } → { embedding: [512 floats] }
POST /tag     { image_url } → { jewelry_type, metal, styles, stones, motif, occasions }
POST /enrich  { image_url } → { embedding, phash, jewelry_type, metal, styles,
                                stones, motif, occasions }
```

All three also accept `{ image_base64 }` for in-memory ingestion pipelines.
`/enrich` does everything the Phase 3 ingester needs from a single image
decode (embedding + perceptual hash + zero-shot tags) and is what
`scripts/ingest` calls per image.

## Tuning

`THRESHOLDS` in `app.py` controls how aggressively each multi-choice facet
emits labels. Crank them down for a more permissive auto-tag; crank up for
fewer but more confident tags. The review gate in `inspiration_images.status`
catches anything the worker mislabels.
