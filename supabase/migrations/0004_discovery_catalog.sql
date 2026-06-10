-- AMI by Arham — discovery catalog (Phase 1)
-- Turns the hand-curated swipe catalog into an attribute-rich, growable,
-- review-gated discovery engine and lays the storage groundwork for the
-- embedding-based recommender (Phase 2).
--
-- This migration is ADDITIVE and backward compatible:
--   • Existing `inspiration_images` rows are treated as `approved` (so the live
--     deck keeps working unchanged).
--   • The structured facets from 0003 (`jewelry_type`, `occasions`, `metals`,
--     `styles`) are REUSED — CLIP zero-shot tags map onto them — so we do NOT
--     duplicate them here. We only add the columns 0003 doesn't already cover:
--     extra taxonomy (`stones`, `motif`), provenance, dedup, status gate, and
--     the embedding vector.
--   • `swipe_events` is a new per-card decision log feeding the recommender.

create extension if not exists "vector";

-- ─────────────────────────────────────────────────────────────────────────────
-- Enums — review-gate status for scraped / ingested inspiration.
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'inspiration_status') then
    create type public.inspiration_status as enum (
      'pending_review',
      'approved',
      'rejected'
    );
  end if;
end$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- inspiration_images — enrichment columns (additive).
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.inspiration_images
  -- Extra taxonomy beyond the 0003 facets (style/metal/occasion already exist).
  add column if not exists stones text[] not null default '{}',
  add column if not exists motif  text[] not null default '{}',

  -- Provenance / attribution (every scraped row carries where it came from).
  add column if not exists source_name    text,
  add column if not exists source_url      text,
  add column if not exists attribution     text,
  add column if not exists license_status  text not null default 'unknown',

  -- Dedup: perceptual hash so the same piece from multiple sources collapses.
  add column if not exists phash text,

  -- Own pieces vs. external inspiration; drives cold-start diversity weighting.
  add column if not exists is_own_catalog boolean not null default false,
  add column if not exists featured       boolean not null default false,

  -- Review gate. Existing rows backfill to 'approved' (see update below); the
  -- ingestion pipeline inserts new scraped rows as 'pending_review' explicitly.
  add column if not exists status public.inspiration_status not null default 'approved',

  -- open_clip ViT-B/32 image fingerprint — 512 dims, CPU-friendly.
  -- Stays server-side only; never selected into client payloads.
  add column if not exists embedding vector(512);

-- Existing rows predate the gate — keep them live.
update public.inspiration_images set status = 'approved' where status is null;

-- ─────────────────────────────────────────────────────────────────────────────
-- Indexes
-- ─────────────────────────────────────────────────────────────────────────────
-- Dedup: one row per perceptual hash (nulls allowed for un-hashed rows).
create unique index if not exists inspiration_images_phash_key
  on public.inspiration_images (phash)
  where phash is not null;

-- Gate filter — every public read narrows to status = 'approved'.
create index if not exists inspiration_images_status_idx
  on public.inspiration_images (status);

-- ANN search over embeddings (cosine). HNSW = fast approximate nearest-neighbor.
create index if not exists inspiration_images_embedding_idx
  on public.inspiration_images using hnsw (embedding vector_cosine_ops);

-- ─────────────────────────────────────────────────────────────────────────────
-- RLS — tighten public read to approved rows only; admins keep full access.
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "inspiration_images_select_public" on public.inspiration_images;
create policy "inspiration_images_select_public"
  on public.inspiration_images
  for select
  to anon, authenticated
  using (status = 'approved');

-- (inspiration_images_admin_all from 0001 still grants authenticated admins
--  full access regardless of status — pending_review rows remain reviewable.)

-- ─────────────────────────────────────────────────────────────────────────────
-- swipe_events — per-card decision log. Anonymous, session-scoped; feeds the
-- taste recommender and future analytics. Mirrors the guest-insert / admin-read
-- conventions used by request_favorite_items in 0001.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.swipe_events (
  id          uuid        primary key default gen_random_uuid(),
  session_id  uuid        not null,
  image_id    uuid        references public.inspiration_images(id) on delete set null,
  decision    text        not null check (decision in ('like', 'pass')),
  position    int,
  created_at  timestamptz not null default now()
);

create index if not exists swipe_events_session_id_idx
  on public.swipe_events (session_id);

create index if not exists swipe_events_image_id_idx
  on public.swipe_events (image_id);

alter table public.swipe_events enable row level security;

-- Guests (anon) can log their swipes; only admins can read them back.
drop policy if exists "swipe_events_insert_guest" on public.swipe_events;
create policy "swipe_events_insert_guest"
  on public.swipe_events
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "swipe_events_admin_read" on public.swipe_events;
create policy "swipe_events_admin_read"
  on public.swipe_events
  for select
  to authenticated
  using (true);
