-- =====================================================================
-- Eat In — 0003 : Storage buckets & policies
--
-- Path conventions:
--   * hotel-logos    : <hotel_id>/<uuid>.<ext>
--   * hotel-covers   : <hotel_id>/<uuid>.<ext>
--   * listing-images : <hotel_id>/<listing_id>/<uuid>.<ext>
--   * avatars        : <user_id>/<uuid>.<ext>
-- storage.foldername(name)[1] gives us the first path segment, which
-- we use to authorize writes.
-- =====================================================================

-- 1. Create buckets (all publicly readable; writes are restricted)
insert into storage.buckets (id, name, public) values
  ('hotel-logos',    'hotel-logos',    true),
  ('hotel-covers',   'hotel-covers',   true),
  ('listing-images', 'listing-images', true),
  ('avatars',        'avatars',        true)
on conflict (id) do nothing;

------------------------------------------------------------------------
-- 2. hotel-logos
------------------------------------------------------------------------
create policy "hotel_logos_public_read" on storage.objects
  for select using (bucket_id = 'hotel-logos');

create policy "hotel_logos_hotel_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'hotel-logos'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

create policy "hotel_logos_hotel_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'hotel-logos'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

create policy "hotel_logos_hotel_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'hotel-logos'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

------------------------------------------------------------------------
-- 3. hotel-covers
------------------------------------------------------------------------
create policy "hotel_covers_public_read" on storage.objects
  for select using (bucket_id = 'hotel-covers');

create policy "hotel_covers_hotel_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'hotel-covers'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

create policy "hotel_covers_hotel_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'hotel-covers'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

create policy "hotel_covers_hotel_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'hotel-covers'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

------------------------------------------------------------------------
-- 4. listing-images
------------------------------------------------------------------------
create policy "listing_images_public_read" on storage.objects
  for select using (bucket_id = 'listing-images');

create policy "listing_images_hotel_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'listing-images'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

create policy "listing_images_hotel_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'listing-images'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

create policy "listing_images_hotel_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'listing-images'
    and public.is_member_of_hotel((storage.foldername(name))[1]::uuid)
  );

------------------------------------------------------------------------
-- 5. avatars
------------------------------------------------------------------------
create policy "avatars_public_read" on storage.objects
  for select using (bucket_id = 'avatars');

create policy "avatars_self_insert" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_self_update" on storage.objects
  for update to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

create policy "avatars_self_delete" on storage.objects
  for delete to authenticated
  using (
    bucket_id = 'avatars'
    and (storage.foldername(name))[1] = auth.uid()::text
  );