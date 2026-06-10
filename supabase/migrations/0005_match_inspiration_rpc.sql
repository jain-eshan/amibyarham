-- AMI by Arham — discovery recommender (Phase 2)
-- Adds the ANN search RPC that powers /api/recommend. Heavy similarity search
-- stays in pgvector (HNSW index from 0004); the API server only does a few
-- small embedding fetches + averaging to derive the taste vector.

-- ─────────────────────────────────────────────────────────────────────────────
-- match_inspiration(query, exclude, match_limit)
--   query        — 512-dim taste vector (mean(liked) − 0.4 * mean(disliked))
--   exclude      — already-seen image ids (cards we shouldn't re-show)
--   match_limit  — how many neighbours to return
--
-- Returns approved, embedded rows ordered by cosine distance to `query`.
-- SECURITY DEFINER so it can read the embedding column under anon RLS without
-- exposing it in the SELECT list — callers get a similarity score, never the
-- raw vector.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace function public.match_inspiration(
  query        vector(512),
  exclude_ids  uuid[]        default '{}',
  match_limit  int           default 30
)
returns table (
  id              uuid,
  image_url       text,
  alt_text        text,
  category        text,
  jewelry_type    text,
  occasions       text[],
  metals          text[],
  styles          text[],
  stones          text[],
  motif           text[],
  source_name     text,
  source_url      text,
  attribution     text,
  featured        boolean,
  is_own_catalog  boolean,
  created_at      timestamptz,
  similarity      float
)
language sql
stable
security definer
set search_path = public
as $$
  select
    i.id,
    i.image_url,
    i.alt_text,
    i.category,
    i.jewelry_type,
    i.occasions,
    i.metals,
    i.styles,
    i.stones,
    i.motif,
    i.source_name,
    i.source_url,
    i.attribution,
    i.featured,
    i.is_own_catalog,
    i.created_at,
    1 - (i.embedding <=> query) as similarity
  from public.inspiration_images i
  where i.status = 'approved'
    and i.embedding is not null
    and (exclude_ids is null or not (i.id = any(exclude_ids)))
  order by i.embedding <=> query
  limit greatest(match_limit, 1);
$$;

grant execute on function public.match_inspiration(vector(512), uuid[], int)
  to anon, authenticated;
