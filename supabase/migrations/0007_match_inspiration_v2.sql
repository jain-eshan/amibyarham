-- AMI by Arham — match_inspiration v2
-- The Smart-Onboarding migration (0006) added metal_colors, diamond_shapes,
-- carat_weight, karatage, item_weight_grams, price_inr and certifications to
-- inspiration_images, but the recommender RPC (0005) was never updated to
-- return them. /api/recommend was filling them with empty/null defaults, so
-- every re-ranked card silently passed budget / shape / karatage / certification
-- filters and step-3 of the quiz had no effect on the deck. v2 carries those
-- columns through so client-side filterDeck() can match real values.

drop function if exists public.match_inspiration(vector, uuid[], int);

create or replace function public.match_inspiration(
  query        vector(512),
  exclude_ids  uuid[]        default '{}',
  match_limit  int           default 30
)
returns table (
  id                 uuid,
  image_url          text,
  alt_text           text,
  category           text,
  jewelry_type       text,
  occasions          text[],
  metals             text[],
  styles             text[],
  stones             text[],
  motif              text[],
  metal_colors       text[],
  diamond_shapes     text[],
  carat_weight       numeric,
  karatage           text[],
  item_weight_grams  numeric,
  price_inr          integer,
  certifications     text[],
  source_name        text,
  source_url         text,
  attribution        text,
  featured           boolean,
  is_own_catalog     boolean,
  created_at         timestamptz,
  similarity         float
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
    i.metal_colors,
    i.diamond_shapes,
    i.carat_weight,
    i.karatage,
    i.item_weight_grams,
    i.price_inr,
    i.certifications,
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
