create table if not exists public.contact_submissions (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz default now() not null
);

alter table public.contact_submissions enable row level security;

-- Allow anonymous inserts (public contact form)
create policy "allow_anon_insert" on public.contact_submissions
  for insert to anon with check (true);

-- Service role can select all
create policy "allow_service_select" on public.contact_submissions
  for select to service_role using (true);
