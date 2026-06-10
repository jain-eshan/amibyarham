# CPU-only CLIP worker. ~1.2 GB image because torch+open_clip+ViT-B/32 weights
# are pulled in at build time; that's fine — it runs on a single small VM next
# to n8n and is hit only at ingestion time.
FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

WORKDIR /app

# System deps for Pillow.
RUN apt-get update \
    && apt-get install -y --no-install-recommends libjpeg62-turbo zlib1g ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

# Pull torch's CPU wheel from PyTorch's index to avoid the much larger CUDA build.
RUN pip install --extra-index-url https://download.pytorch.org/whl/cpu -r requirements.txt

COPY app.py .

# Pre-download the ViT-B/32 OpenAI weights at build time so first request is
# fast and the container has no outbound dependency at runtime.
RUN python -c "import open_clip; open_clip.create_model_and_transforms('ViT-B-32', pretrained='openai')"

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
