-- AMI by Arham — storage buckets
-- - inspiration-images: admin-curated swipe assets (public read).
-- - user-uploads:       guest-supplied reference images (public read so admins
--                       can preview submissions via the stored URL; writes are
--                       guarded by storage policies below).

insert into storage.buckets (id, name, public)
values
  ('inspiration-images', 'inspiration-images', true),
  ('user-uploads',       'user-uploads',       true)
on conflict (id) do nothing;

-- ─────────────────────────────────────────────────────────────────────────────
-- inspiration-images: public can read; only authenticated admins can write.
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "inspiration_images_public_read" on storage.objects;
create policy "inspiration_images_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'inspiration-images');

drop policy if exists "inspiration_images_admin_write" on storage.objects;
create policy "inspiration_images_admin_write"
  on storage.objects
  for all
  to authenticated
  using (bucket_id = 'inspiration-images')
  with check (bucket_id = 'inspiration-images');

-- ─────────────────────────────────────────────────────────────────────────────
-- user-uploads: guests may insert reference images attached to a submission;
-- everyone can read (so admins can render the file from its stored URL);
-- only admins can delete.
-- ─────────────────────────────────────────────────────────────────────────────
drop policy if exists "user_uploads_public_read" on storage.objects;
create policy "user_uploads_public_read"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'user-uploads');

drop policy if exists "user_uploads_guest_insert" on storage.objects;
create policy "user_uploads_guest_insert"
  on storage.objects
  for insert
  to anon, authenticated
  with check (bucket_id = 'user-uploads');

drop policy if exists "user_uploads_admin_delete" on storage.objects;
create policy "user_uploads_admin_delete"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'user-uploads');
