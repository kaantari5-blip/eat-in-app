-- =====================================================================
-- Eat In — 0002 : Row Level Security
--   * Helper functions used by both RLS and RPCs (security definer)
--   * Enable RLS on every table
--   * Policies organized per table
--
-- Authorization model
--   - Database is the primary defence (these policies).
--   - The Next.js app *also* checks roles in server actions for nicer
--     UX and Turkish error messages, but never relies on it for
--     security.
--   - The `service_role` key (server-only) bypasses RLS for things like
--     payment webhooks, admin migrations, audit log writes.
-- =====================================================================

------------------------------------------------------------------------
-- 1. Helper functions (used by RLS and by RPCs)
------------------------------------------------------------------------
create or replace function public.current_role()
returns user_role language sql stable security definer set search_path = public as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean language sql stable security definer set search_path = public as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

create or replace function public.is_hotel_owner(p_hotel_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.hotels h
     where h.id = p_hotel_id and h.owner_id = auth.uid()
  );
$$;

create or replace function public.is_member_of_hotel(p_hotel_id uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select
    exists (select 1 from public.hotels      h  where h.id      = p_hotel_id and h.owner_id = auth.uid())
    or
    exists (select 1 from public.hotel_staff hs where hs.hotel_id = p_hotel_id and hs.user_id  = auth.uid());
$$;

grant execute on function
  public.current_role(),
  public.is_admin(),
  public.is_hotel_owner(uuid),
  public.is_member_of_hotel(uuid)
to anon, authenticated;

------------------------------------------------------------------------
-- 2. Enable RLS on every table
------------------------------------------------------------------------
alter table public.profiles               enable row level security;
alter table public.hotels                 enable row level security;
alter table public.hotel_staff            enable row level security;
alter table public.hotel_operating_hours  enable row level security;
alter table public.categories             enable row level security;
alter table public.listings               enable row level security;
alter table public.orders                 enable row level security;
alter table public.order_items            enable row level security;
alter table public.payments               enable row level security;
alter table public.payment_webhook_events enable row level security;
alter table public.refunds                enable row level security;
alter table public.reviews                enable row level security;
alter table public.favorites              enable row level security;
alter table public.notifications          enable row level security;
alter table public.audit_logs             enable row level security;

-- Force RLS even for table owners (defence in depth)
alter table public.payments               force row level security;
alter table public.payment_webhook_events force row level security;
alter table public.refunds                force row level security;
alter table public.audit_logs             force row level security;

------------------------------------------------------------------------
-- 3. profiles
------------------------------------------------------------------------
create policy "profiles_self_read" on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_admin());

-- Self update; role cannot be self-elevated.
create policy "profiles_self_update" on public.profiles
  for update to authenticated
  using (id = auth.uid())
  with check (
    id = auth.uid()
    and role = (select role from public.profiles where id = auth.uid())
  );

create policy "profiles_admin_all" on public.profiles
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

------------------------------------------------------------------------
-- 4. hotels
------------------------------------------------------------------------
-- Anyone (incl. anon) can see approved hotels in the marketplace.
create policy "hotels_public_read_approved" on public.hotels
  for select to anon, authenticated
  using (status = 'approved');

create policy "hotels_owner_read" on public.hotels
  for select to authenticated
  using (owner_id = auth.uid() or public.is_admin());

-- Anyone authenticated may apply to list a hotel.
create policy "hotels_owner_insert" on public.hotels
  for insert to authenticated
  with check (owner_id = auth.uid() and status = 'pending');

-- Owner may edit details, but cannot self-approve / change status.
create policy "hotels_owner_update" on public.hotels
  for update to authenticated
  using (owner_id = auth.uid())
  with check (
    owner_id = auth.uid()
    and status = (select status from public.hotels where id = hotels.id)
  );

create policy "hotels_admin_all" on public.hotels
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

------------------------------------------------------------------------
-- 5. hotel_staff
------------------------------------------------------------------------
create policy "hotel_staff_owner_manage" on public.hotel_staff
  for all to authenticated
  using (public.is_hotel_owner(hotel_id) or public.is_admin())
  with check (public.is_hotel_owner(hotel_id) or public.is_admin());

create policy "hotel_staff_self_read" on public.hotel_staff
  for select to authenticated
  using (user_id = auth.uid());

------------------------------------------------------------------------
-- 6. hotel_operating_hours
------------------------------------------------------------------------
create policy "operating_hours_public_read" on public.hotel_operating_hours
  for select to anon, authenticated using (true);

create policy "operating_hours_hotel_manage" on public.hotel_operating_hours
  for all to authenticated
  using (public.is_member_of_hotel(hotel_id) or public.is_admin())
  with check (public.is_member_of_hotel(hotel_id) or public.is_admin());

------------------------------------------------------------------------
-- 7. categories
------------------------------------------------------------------------
create policy "categories_public_read" on public.categories
  for select to anon, authenticated
  using (is_active or public.is_admin());

create policy "categories_admin_all" on public.categories
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

------------------------------------------------------------------------
-- 8. listings
------------------------------------------------------------------------
create policy "listings_public_read_active" on public.listings
  for select to anon, authenticated
  using (status = 'active');

create policy "listings_hotel_read_own" on public.listings
  for select to authenticated
  using (public.is_member_of_hotel(hotel_id) or public.is_admin());

create policy "listings_hotel_write" on public.listings
  for all to authenticated
  using (public.is_member_of_hotel(hotel_id) or public.is_admin())
  with check (public.is_member_of_hotel(hotel_id) or public.is_admin());

------------------------------------------------------------------------
-- 9. orders
------------------------------------------------------------------------
create policy "orders_customer_read" on public.orders
  for select to authenticated
  using (customer_id = auth.uid());

create policy "orders_hotel_read" on public.orders
  for select to authenticated
  using (public.is_member_of_hotel(hotel_id) or public.is_admin());

-- Direct customer insert is allowed but normal flow is via create_order() RPC.
create policy "orders_customer_insert" on public.orders
  for insert to authenticated
  with check (customer_id = auth.uid() and status = 'pending_payment');

-- Customers may cancel only while still unpaid.
create policy "orders_customer_cancel" on public.orders
  for update to authenticated
  using (customer_id = auth.uid() and status = 'pending_payment')
  with check (customer_id = auth.uid() and status in ('pending_payment','cancelled'));

create policy "orders_hotel_update" on public.orders
  for update to authenticated
  using (public.is_member_of_hotel(hotel_id) or public.is_admin())
  with check (public.is_member_of_hotel(hotel_id) or public.is_admin());

------------------------------------------------------------------------
-- 10. order_items
------------------------------------------------------------------------
create policy "order_items_read" on public.order_items
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
       where o.id = order_id
         and (
           o.customer_id = auth.uid()
           or public.is_member_of_hotel(o.hotel_id)
           or public.is_admin()
         )
    )
  );

-- order_items are inserted by create_order() (security definer).
-- No client-direct insert policy.

------------------------------------------------------------------------
-- 11. payments
------------------------------------------------------------------------
create policy "payments_read" on public.payments
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
       where o.id = order_id
         and (
           o.customer_id = auth.uid()
           or public.is_member_of_hotel(o.hotel_id)
           or public.is_admin()
         )
    )
  );
-- Writes: service_role only (no client policies).

------------------------------------------------------------------------
-- 12. payment_webhook_events
------------------------------------------------------------------------
-- service_role only (no policies). RLS enabled means default deny.

------------------------------------------------------------------------
-- 13. refunds
------------------------------------------------------------------------
create policy "refunds_read" on public.refunds
  for select to authenticated
  using (
    exists (
      select 1 from public.orders o
       where o.id = order_id
         and (
           o.customer_id = auth.uid()
           or public.is_member_of_hotel(o.hotel_id)
           or public.is_admin()
         )
    )
  );
-- Writes: service_role only.

------------------------------------------------------------------------
-- 14. reviews
------------------------------------------------------------------------
create policy "reviews_public_read" on public.reviews
  for select to anon, authenticated using (true);

-- Customer can only review their *own completed* order.
create policy "reviews_customer_insert" on public.reviews
  for insert to authenticated
  with check (
    customer_id = auth.uid()
    and exists (
      select 1 from public.orders o
       where o.id = order_id
         and o.customer_id = auth.uid()
         and o.status = 'completed'
    )
  );

create policy "reviews_customer_update" on public.reviews
  for update to authenticated
  using (customer_id = auth.uid())
  with check (customer_id = auth.uid());

-- Hotel can only edit hotel_reply / hotel_reply_at fields on their reviews.
-- (Field-level enforcement is added via a trigger below.)
create policy "reviews_hotel_reply_update" on public.reviews
  for update to authenticated
  using (public.is_member_of_hotel(hotel_id))
  with check (public.is_member_of_hotel(hotel_id));

create policy "reviews_admin_all" on public.reviews
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- Field-level guard: hotel members can only touch hotel_reply / hotel_reply_at.
create or replace function public.reviews_guard_hotel_update()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  -- Skip for the customer themselves and for admins
  if new.customer_id = auth.uid() or public.is_admin() then
    return new;
  end if;
  if public.is_member_of_hotel(new.hotel_id) then
    if new.rating      is distinct from old.rating
       or new.comment  is distinct from old.comment
       or new.order_id is distinct from old.order_id
       or new.customer_id is distinct from old.customer_id
       or new.hotel_id    is distinct from old.hotel_id then
      raise exception 'hotel can only edit reply fields';
    end if;
    new.hotel_reply_at := coalesce(new.hotel_reply_at, now());
  end if;
  return new;
end;
$$;

drop trigger if exists trg_reviews_guard_hotel on public.reviews;
create trigger trg_reviews_guard_hotel
  before update on public.reviews
  for each row execute function public.reviews_guard_hotel_update();

------------------------------------------------------------------------
-- 15. favorites (private to the customer)
------------------------------------------------------------------------
create policy "favorites_self_all" on public.favorites
  for all to authenticated
  using (customer_id = auth.uid()) with check (customer_id = auth.uid());

------------------------------------------------------------------------
-- 16. notifications
------------------------------------------------------------------------
create policy "notifications_self_read" on public.notifications
  for select to authenticated using (user_id = auth.uid());

create policy "notifications_self_update" on public.notifications
  for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
-- Inserts come from triggers / service_role.

------------------------------------------------------------------------
-- 17. audit_logs
------------------------------------------------------------------------
create policy "audit_logs_admin_read" on public.audit_logs
  for select to authenticated using (public.is_admin());
-- Writes: service_role only.