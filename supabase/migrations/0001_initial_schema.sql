-- AMI by Arham — initial schema
-- Tables: inspiration_images, leads, custom_requests, request_favorite_items
-- RLS: guest (anon) can INSERT submissions; authenticated (admin) has full access.

create extension if not exists "pgcrypto";

-- ─────────────────────────────────────────────────────────────────────────────
-- Enums
-- ─────────────────────────────────────────────────────────────────────────────
do $$
begin
  if not exists (select 1 from pg_type where typname = 'custom_request_type') then
    create type public.custom_request_type as enum (
      'external_link',
      'direct_upload',
      'swipe_board'
    );
  end if;

  if not exists (select 1 from pg_type where typname = 'custom_request_status') then
    create type public.custom_request_status as enum (
      'pending',
      'contacted',
      'converted',
      'closed'
    );
  end if;
end$$;

-- ─────────────────────────────────────────────────────────────────────────────
-- inspiration_images — admin-curated catalog used by the Swipe Engine.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.inspiration_images (
  id          uuid        primary key default gen_random_uuid(),
  image_url   text        not null,
  alt_text    text,
  category    text,
  created_at  timestamptz not null default now()
);

create index if not exists inspiration_images_category_idx
  on public.inspiration_images (category);

-- ─────────────────────────────────────────────────────────────────────────────
-- leads — guest contact info for every submission.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.leads (
  id              uuid        primary key default gen_random_uuid(),
  full_name       text        not null,
  whatsapp_number text        not null,
  email           text,
  created_at      timestamptz not null default now()
);

-- ─────────────────────────────────────────────────────────────────────────────
-- custom_requests — Path A or Path B bespoke inquiry.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.custom_requests (
  id                  uuid                          primary key default gen_random_uuid(),
  lead_id             uuid                          not null references public.leads(id) on delete cascade,
  request_type        public.custom_request_type    not null,
  external_url        text,
  uploaded_media_url  text,
  design_notes        text,
  status              public.custom_request_status  not null default 'pending',
  created_at          timestamptz                   not null default now()
);

create index if not exists custom_requests_lead_id_idx
  on public.custom_requests (lead_id);

create index if not exists custom_requests_status_idx
  on public.custom_requests (status);

-- ─────────────────────────────────────────────────────────────────────────────
-- request_favorite_items — junction: swipe-board request ↔ inspiration_images.
-- ─────────────────────────────────────────────────────────────────────────────
create table if not exists public.request_favorite_items (
  request_id uuid not null references public.custom_requests(id)   on delete cascade,
  image_id   uuid not null references public.inspiration_images(id) on delete cascade,
  primary key (request_id, image_id)
);

create index if not exists request_favorite_items_image_id_idx
  on public.request_favorite_items (image_id);

-- ─────────────────────────────────────────────────────────────────────────────
-- Row Level Security
-- ─────────────────────────────────────────────────────────────────────────────
alter table public.inspiration_images     enable row level security;
alter table public.leads                  enable row level security;
alter table public.custom_requests        enable row level security;
alter table public.request_favorite_items enable row level security;

-- inspiration_images: public read (swipe engine is guest-accessible);
-- only authenticated admins can mutate the catalog.
drop policy if exists "inspiration_images_select_public" on public.inspiration_images;
create policy "inspiration_images_select_public"
  on public.inspiration_images
  for select
  to anon, authenticated
  using (true);

drop policy if exists "inspiration_images_admin_all" on public.inspiration_images;
create policy "inspiration_images_admin_all"
  on public.inspiration_images
  for all
  to authenticated
  using (true)
  with check (true);

-- leads: guests can insert their own contact info; only admins can read.
drop policy if exists "leads_insert_guest" on public.leads;
create policy "leads_insert_guest"
  on public.leads
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "leads_admin_read" on public.leads;
create policy "leads_admin_read"
  on public.leads
  for select
  to authenticated
  using (true);

drop policy if exists "leads_admin_update" on public.leads;
create policy "leads_admin_update"
  on public.leads
  for update
  to authenticated
  using (true)
  with check (true);

-- custom_requests: guests can submit; only admins can read/update/delete.
drop policy if exists "custom_requests_insert_guest" on public.custom_requests;
create policy "custom_requests_insert_guest"
  on public.custom_requests
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "custom_requests_admin_read" on public.custom_requests;
create policy "custom_requests_admin_read"
  on public.custom_requests
  for select
  to authenticated
  using (true);

drop policy if exists "custom_requests_admin_update" on public.custom_requests;
create policy "custom_requests_admin_update"
  on public.custom_requests
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "custom_requests_admin_delete" on public.custom_requests;
create policy "custom_requests_admin_delete"
  on public.custom_requests
  for delete
  to authenticated
  using (true);

-- request_favorite_items: guests can write rows when they submit a swipe board;
-- only admins can read.
drop policy if exists "request_favorite_items_insert_guest" on public.request_favorite_items;
create policy "request_favorite_items_insert_guest"
  on public.request_favorite_items
  for insert
  to anon, authenticated
  with check (true);

drop policy if exists "request_favorite_items_admin_read" on public.request_favorite_items;
create policy "request_favorite_items_admin_read"
  on public.request_favorite_items
  for select
  to authenticated
  using (true);
