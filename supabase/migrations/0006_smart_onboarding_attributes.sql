-- AMI by Arham — Smart-Onboarding filter attributes
-- The /discover quiz is becoming a 3-step branching flow (Core Intent → Gate
-- → Tailored Deep Dive). The deep-dive step asks about facets that the original
-- 4-facet filter couldn't capture: metal color, diamond shape, carat, karatage,
-- piece weight, price (budget tier) and lab certification. These columns make
-- those facets addressable so the same client-side filterDeck() helper can
-- match them.
--
-- All columns are nullable / default-empty so existing rows remain valid and
-- the new filters treat missing values as "unconstrained" (the piece still
-- shows up for any selection).

alter table public.inspiration_images
  add column if not exists metal_colors      text[] not null default '{}', -- Yellow / White / Rose Gold
  add column if not exists diamond_shapes    text[] not null default '{}', -- Round / Oval / Emerald / …
  add column if not exists carat_weight      numeric(5,2),                 -- 0.25 … 30.00
  add column if not exists karatage          text[] not null default '{}', -- 14K / 18K / 22K
  add column if not exists item_weight_grams numeric(6,2),                 -- gross weight in grams
  add column if not exists price_inr         integer,                      -- representative price for budget-tier filtering
  add column if not exists certifications    text[] not null default '{}'; -- GIA / IGI / HRD

-- Multi-value array facets: GIN so array-overlap (&&) filters stay fast.
create index if not exists inspiration_images_metal_colors_idx
  on public.inspiration_images using gin (metal_colors);
create index if not exists inspiration_images_diamond_shapes_idx
  on public.inspiration_images using gin (diamond_shapes);
create index if not exists inspiration_images_karatage_idx
  on public.inspiration_images using gin (karatage);
create index if not exists inspiration_images_certifications_idx
  on public.inspiration_images using gin (certifications);

-- Range scans (carat slider, budget tier, weight buckets) — plain btree.
create index if not exists inspiration_images_carat_weight_idx
  on public.inspiration_images (carat_weight);
create index if not exists inspiration_images_price_inr_idx
  on public.inspiration_images (price_inr);
create index if not exists inspiration_images_item_weight_grams_idx
  on public.inspiration_images (item_weight_grams);
