-- AMI by Arham — discovery filter attributes
-- Adds the structured facets the Filter-First Swipe Flow filters on:
--   Jewelry Type · Occasion · Metal · Style
--
-- Design intent: the whole (small) catalogue is loaded once and filtered +
-- counted client-side so the "N pieces match" CTA can update instantly as the
-- user toggles chips. These columns are what make a piece addressable by that
-- filter UI. A piece has exactly ONE jewelry type, but can be relevant to
-- several occasions / be offered in several metals / read as several styles —
-- hence text[] for those three.

-- ─────────────────────────────────────────────────────────────────────────────
-- inspiration_images — facet columns
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.inspiration_images
  add column if not exists jewelry_type text,                       -- Ring / Necklace / Earrings / Bracelet / Maang Tikka / Set
  add column if not exists occasions    text[] not null default '{}', -- Wedding / Engagement / Everyday / Statement
  add column if not exists metals       text[] not null default '{}', -- 18k Gold / 22k Gold / Rose Gold / White Gold
  add column if not exists styles       text[] not null default '{}'; -- Polki / Jadau / Modern / Minimalist

-- Single-value facet: plain btree for equality / IN () filters.
create index if not exists inspiration_images_jewelry_type_idx
  on public.inspiration_images (jewelry_type);

-- Multi-value facets: GIN so array-overlap (&&) filters stay fast as the
-- catalogue grows and filtering eventually moves server-side.
create index if not exists inspiration_images_occasions_idx
  on public.inspiration_images using gin (occasions);
create index if not exists inspiration_images_metals_idx
  on public.inspiration_images using gin (metals);
create index if not exists inspiration_images_styles_idx
  on public.inspiration_images using gin (styles);

-- ─────────────────────────────────────────────────────────────────────────────
-- custom_requests — capture which filters produced a swipe board.
-- Stored as jsonb (shape: { jewelryType: [], occasion: [], metal: [], style: [] })
-- for lead context + future analytics ("most-requested combinations"). Optional,
-- so existing insert paths keep working untouched.
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.custom_requests
  add column if not exists applied_filters jsonb;
