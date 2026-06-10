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
POST /embed  { image_url } → { embedding: [512 floats] }
POST /tag    { image_url } → { jewelry_type, metal, styles, stones, motif, occasions }
```

Both also accept `{ image_base64 }` for in-memory ingestion pipelines.

## Tuning

`THRESHOLDS` in `app.py` controls how aggressively each multi-choice facet
emits labels. Crank them down for a more permissive auto-tag; crank up for
fewer but more confident tags. The review gate in `inspiration_images.status`
catches anything the worker mislabels.
