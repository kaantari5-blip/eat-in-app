-- =====================================================================
-- Eat In — 0001 : Initial schema
--   * Extensions
--   * Enum types
--   * Tables (with constraints, FKs, indexes)
--   * Auto-field triggers (updated_at, order_number, hotel slug)
--   * Transactional RPCs (create_order, mark_order_paid, verify_pickup)
--
-- Conventions:
--   - UUID primary keys (gen_random_uuid()).
--   - Money as numeric(10,2); currency codes ISO-4217, default 'TRY'.
--   - All DB text is language-neutral (slugs, enums, statuses). Turkish
--     strings live in the Next.js layer (src/lib/i18n/tr.ts).
--   - created_at / updated_at on mutable tables.
--   - Foreign keys use ON DELETE RESTRICT on financial tables and
--     CASCADE on child rows that have no meaning without the parent.
-- =====================================================================

------------------------------------------------------------------------
-- 1. Extensions
------------------------------------------------------------------------
create extension if not exists "pgcrypto";
create extension if not exists "uuid-ossp";
create extension if not exists "citext";

------------------------------------------------------------------------
-- 2. Enum types
------------------------------------------------------------------------
create type user_role         as enum ('customer', 'hotel_owner', 'hotel_staff', 'admin');
create type hotel_status      as enum ('pending', 'approved', 'suspended', 'rejected');
create type hotel_staff_role  as enum ('manager', 'staff');
create type listing_status    as enum ('draft', 'active', 'sold_out', 'expired', 'archived');
create type order_status      as enum (
  'pending_payment', 'paid', 'ready_for_pickup',
  'completed', 'cancelled', 'refunded', 'expired'
);
create type payment_status    as enum (
  'pending', 'authorized', 'captured',
  'failed', 'refunded', 'partially_refunded'
);
create type payment_provider  as enum ('stripe', 'iyzico');
create type notification_type as enum (
  'order_paid', 'order_ready', 'order_completed',
  'order_cancelled', 'order_refunded',
  'listing_low_stock', 'listing_expiring',
  'hotel_approved', 'hotel_rejected', 'hotel_suspended',
  'review_received', 'system'
);

------------------------------------------------------------------------
-- 3. Tables
------------------------------------------------------------------------

-- 3.1 profiles (1:1 with auth.users) -----------------------------------
create table public.profiles (
  id               uuid primary key references auth.users(id) on delete cascade,
  role             user_role not null default 'customer',
  full_name        text,
  phone            text,
  avatar_url       text,
  locale           text not null default 'tr',
  marketing_opt_in boolean not null default false,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint profiles_phone_format_chk
    check (phone is null or phone ~ '^\+?[0-9 ()-]{7,20}$')
);

-- 3.2 hotels -----------------------------------------------------------
create table public.hotels (
  id               uuid primary key default gen_random_uuid(),
  owner_id         uuid not null references public.profiles(id) on delete restrict,
  name             text not null,
  slug             text not null unique,
  description      text,
  logo_url         text,
  cover_url        text,
  phone            text,
  email            citext,
  status           hotel_status not null default 'pending',
  address_line     text not null,
  district         text,
  city             text not null,
  postal_code      text,
  country          text not null default 'TR',
  latitude         numeric(10,7),
  longitude        numeric(10,7),
  tax_number       text,
  iban             text,
  commission_rate  numeric(5,2) not null default 15.00,
  rejected_reason  text,
  suspended_reason text,
  approved_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now(),
  constraint hotels_slug_format_chk
    check (slug ~ '^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$'),
  constraint hotels_commission_range_chk
    check (commission_rate between 0 and 100),
  constraint hotels_lat_range_chk
    check (latitude is null or latitude between -90 and 90),
  constraint hotels_lng_range_chk
    check (longitude is null or longitude between -180 and 180)
);
create index hotels_owner_idx    on public.hotels(owner_id);
create index hotels_status_idx   on public.hotels(status);
create index hotels_city_idx     on public.hotels(city);
create index hotels_geo_idx      on public.hotels(latitude, longitude) where latitude is not null;
create index hotels_approved_idx on public.hotels(id) where status = 'approved';

-- 3.3 hotel_staff ------------------------------------------------------
create table public.hotel_staff (
  hotel_id   uuid not null references public.hotels(id) on delete cascade,
  user_id    uuid not null references public.profiles(id) on delete cascade,
  role       hotel_staff_role not null default 'staff',
  created_at timestamptz not null default now(),
  primary key (hotel_id, user_id)
);
create index hotel_staff_user_idx on public.hotel_staff(user_id);

-- 3.4 hotel_operating_hours -------------------------------------------
create table public.hotel_operating_hours (
  hotel_id    uuid not null references public.hotels(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6), -- 0 = Sunday
  open_time   time not null,
  close_time  time not null,
  is_closed   boolean not null default false,
  primary key (hotel_id, day_of_week),
  constraint hotel_hours_order_chk
    check (is_closed or close_time > open_time)
);

-- 3.5 categories -------------------------------------------------------
create table public.categories (
  id         uuid primary key default gen_random_uuid(),
  slug       text not null unique,
  name_tr    text not null,
  icon       text,
  sort_order int not null default 0,
  is_active  boolean not null default true,
  created_at timestamptz not null default now(),
  constraint categories_slug_format_chk
    check (slug ~ '^[a-z0-9-]{2,40}$')
);

-- 3.6 listings ---------------------------------------------------------
create table public.listings (
  id                 uuid primary key default gen_random_uuid(),
  hotel_id           uuid not null references public.hotels(id) on delete cascade,
  category_id        uuid references public.categories(id) on delete set null,
  title              text not null,
  description        text,
  image_url          text,
  currency           text not null default 'TRY',
  original_price     numeric(10,2) not null,
  discounted_price   numeric(10,2) not null,
  total_quantity     int not null,
  available_quantity int not null,
  pickup_start_at    timestamptz not null,
  pickup_end_at      timestamptz not null,
  allergen_info      text,
  is_featured        boolean not null default false,
  status             listing_status not null default 'active',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint listings_title_len_chk          check (char_length(title) between 3 and 120),
  constraint listings_original_price_chk     check (original_price   >= 0),
  constraint listings_discounted_price_chk   check (discounted_price >= 0),
  constraint listings_price_order_chk        check (discounted_price <= original_price),
  constraint listings_total_quantity_chk     check (total_quantity     >= 0),
  constraint listings_avail_quantity_chk     check (available_quantity >= 0 and available_quantity <= total_quantity),
  constraint listings_pickup_window_chk      check (pickup_end_at > pickup_start_at),
  constraint listings_currency_chk           check (currency in ('TRY','USD','EUR'))
);
create index listings_hotel_idx    on public.listings(hotel_id);
create index listings_category_idx on public.listings(category_id);
create index listings_status_idx   on public.listings(status);
create index listings_pickup_idx   on public.listings(pickup_start_at, pickup_end_at);
create index listings_active_idx   on public.listings(hotel_id, pickup_start_at) where status = 'active';
create index listings_featured_idx on public.listings(is_featured)              where is_featured and status = 'active';

-- 3.7 orders -----------------------------------------------------------
create table public.orders (
  id                     uuid primary key default gen_random_uuid(),
  order_number           text not null unique,  -- e.g. EI-2026-000123
  customer_id            uuid not null references public.profiles(id) on delete restrict,
  hotel_id               uuid not null references public.hotels(id)   on delete restrict,
  status                 order_status not null default 'pending_payment',
  currency               text not null default 'TRY',
  subtotal               numeric(10,2) not null,
  service_fee            numeric(10,2) not null default 0,
  total                  numeric(10,2) not null,
  commission_amount      numeric(10,2) not null default 0,
  hotel_payout           numeric(10,2) not null default 0,
  pickup_code            text unique,
  pickup_code_expires_at timestamptz,
  picked_up_at           timestamptz,
  picked_up_by_user_id   uuid references public.profiles(id),
  cancellation_reason    text,
  customer_note          text,
  idempotency_key        text unique,
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),
  constraint orders_subtotal_chk    check (subtotal    >= 0),
  constraint orders_service_fee_chk check (service_fee >= 0),
  constraint orders_total_chk       check (total       >= 0),
  constraint orders_total_sum_chk   check (abs(total - (subtotal + service_fee)) < 0.01),
  constraint orders_currency_chk    check (currency in ('TRY','USD','EUR'))
);
create index orders_customer_idx       on public.orders(customer_id);
create index orders_hotel_idx          on public.orders(hotel_id);
create index orders_status_idx         on public.orders(status);
create index orders_created_idx        on public.orders(created_at desc);
create index orders_pickup_active_idx  on public.orders(hotel_id)
  where status in ('paid','ready_for_pickup');

-- 3.8 order_items ------------------------------------------------------
create table public.order_items (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders(id)   on delete cascade,
  listing_id          uuid not null references public.listings(id) on delete restrict,
  -- Immutable snapshot at purchase time (so later edits to listing
  -- do not rewrite history).
  title               text not null,
  unit_price          numeric(10,2) not null,
  original_unit_price numeric(10,2) not null,
  quantity            int not null,
  line_total          numeric(10,2) not null,
  constraint order_items_qty_chk   check (quantity > 0),
  constraint order_items_total_chk check (abs(line_total - unit_price * quantity) < 0.01)
);
create index order_items_order_idx   on public.order_items(order_id);
create index order_items_listing_idx on public.order_items(listing_id);

-- 3.9 payments ---------------------------------------------------------
create table public.payments (
  id                  uuid primary key default gen_random_uuid(),
  order_id            uuid not null references public.orders(id) on delete cascade,
  provider            payment_provider not null,
  provider_intent_id  text,
  provider_payment_id text,
  status              payment_status not null default 'pending',
  amount              numeric(10,2) not null,
  currency            text not null default 'TRY',
  error_code          text,
  error_message       text,
  raw_response        jsonb,
  captured_at         timestamptz,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  constraint payments_amount_chk check (amount >= 0)
);
create unique index payments_provider_intent_uidx
  on public.payments(provider, provider_intent_id)
  where provider_intent_id is not null;
create index payments_order_idx  on public.payments(order_id);
create index payments_status_idx on public.payments(status);

-- 3.10 payment_webhook_events -----------------------------------------
-- Idempotent log of provider webhooks so we never double-process.
create table public.payment_webhook_events (
  id               uuid primary key default gen_random_uuid(),
  provider         payment_provider not null,
  event_id         text not null,
  event_type       text not null,
  payload          jsonb not null,
  processed_at     timestamptz,
  processing_error text,
  received_at      timestamptz not null default now(),
  constraint payment_webhook_events_uniq_event unique (provider, event_id)
);
create index payment_webhook_events_unprocessed_idx
  on public.payment_webhook_events(received_at)
  where processed_at is null;

-- 3.11 refunds --------------------------------------------------------
create table public.refunds (
  id                 uuid primary key default gen_random_uuid(),
  payment_id         uuid not null references public.payments(id) on delete cascade,
  order_id           uuid not null references public.orders(id)   on delete cascade,
  amount             numeric(10,2) not null,
  currency           text not null default 'TRY',
  reason             text,
  provider_refund_id text,
  status             payment_status not null default 'pending',
  raw_response       jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  constraint refunds_amount_chk check (amount > 0)
);
create index refunds_order_idx   on public.refunds(order_id);
create index refunds_payment_idx on public.refunds(payment_id);

-- 3.12 reviews --------------------------------------------------------
create table public.reviews (
  id             uuid primary key default gen_random_uuid(),
  order_id       uuid not null unique references public.orders(id) on delete cascade,
  customer_id    uuid not null references public.profiles(id) on delete cascade,
  hotel_id       uuid not null references public.hotels(id)   on delete cascade,
  rating         smallint not null,
  comment        text,
  hotel_reply    text,
  hotel_reply_at timestamptz,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now(),
  constraint reviews_rating_chk      check (rating between 1 and 5),
  constraint reviews_comment_len_chk check (comment is null or char_length(comment) <= 1000)
);
create index reviews_hotel_idx    on public.reviews(hotel_id);
create index reviews_customer_idx on public.reviews(customer_id);
create index reviews_created_idx  on public.reviews(hotel_id, created_at desc);

-- 3.13 favorites ------------------------------------------------------
create table public.favorites (
  customer_id uuid not null references public.profiles(id) on delete cascade,
  hotel_id    uuid not null references public.hotels(id)   on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (customer_id, hotel_id)
);
create index favorites_hotel_idx on public.favorites(hotel_id);

-- 3.14 notifications --------------------------------------------------
create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  type       notification_type not null,
  title      text not null,
  body       text,
  data       jsonb not null default '{}',
  read_at    timestamptz,
  created_at timestamptz not null default now()
);
create index notifications_user_unread_idx
  on public.notifications(user_id, created_at desc)
  where read_at is null;
create index notifications_user_idx
  on public.notifications(user_id, created_at desc);

-- 3.15 audit_logs -----------------------------------------------------
create table public.audit_logs (
  id          bigserial primary key,
  actor_id    uuid references public.profiles(id),
  action      text not null,
  entity_type text,
  entity_id   uuid,
  metadata    jsonb not null default '{}',
  ip_address  inet,
  user_agent  text,
  created_at  timestamptz not null default now()
);
create index audit_logs_actor_idx   on public.audit_logs(actor_id);
create index audit_logs_entity_idx  on public.audit_logs(entity_type, entity_id);
create index audit_logs_created_idx on public.audit_logs(created_at desc);

------------------------------------------------------------------------
-- 4. updated_at trigger
------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

do $$
declare t text;
begin
  for t in
    select unnest(array[
      'profiles','hotels','listings','orders','payments','refunds','reviews'
    ])
  loop
    execute format(
      'drop trigger if exists trg_%1$s_updated_at on public.%1$s;
       create trigger trg_%1$s_updated_at
         before update on public.%1$s
         for each row execute function public.set_updated_at();',
      t
    );
  end loop;
end $$;

------------------------------------------------------------------------
-- 5. Auto profile on auth signup
------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

------------------------------------------------------------------------
-- 6. Slug / order_number / pickup_code helpers & triggers
------------------------------------------------------------------------
-- slugify: Turkish-aware lowercase + ascii + dash
create or replace function public.slugify(input text)
returns text language sql immutable as $$
  select regexp_replace(
           regexp_replace(
             lower(translate(
               input,
               'çÇğĞıİöÖşŞüÜâÂîÎûÛ',
               'ccggiiooSSuuaaiiuu'
             )),
             '[^a-z0-9]+', '-', 'g'),
           '(^-|-$)', '', 'g')
$$;

-- Auto-slug for hotels (unique via counter suffix)
create or replace function public.hotels_fill_slug()
returns trigger language plpgsql as $$
declare
  base      text;
  candidate text;
  i int := 0;
begin
  if new.slug is null or length(new.slug) = 0 then
    base      := public.slugify(new.name);
    candidate := base;
    while exists(select 1 from public.hotels where slug = candidate and id <> new.id) loop
      i := i + 1;
      candidate := base || '-' || i::text;
    end loop;
    new.slug := candidate;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_hotels_fill_slug on public.hotels;
create trigger trg_hotels_fill_slug
  before insert on public.hotels
  for each row execute function public.hotels_fill_slug();

-- Monotonic order numbers: EI-YYYY-NNNNNN
create sequence if not exists public.order_number_seq;

create or replace function public.generate_order_number()
returns text language plpgsql as $$
declare seq bigint;
begin
  seq := nextval('public.order_number_seq');
  return 'EI-' || to_char(now(),'YYYY') || '-' || lpad(seq::text, 6, '0');
end;
$$;

create or replace function public.orders_fill_order_number()
returns trigger language plpgsql as $$
begin
  if new.order_number is null or length(new.order_number) = 0 then
    new.order_number := public.generate_order_number();
  end if;
  return new;
end;
$$;

drop trigger if exists trg_orders_fill_order_number on public.orders;
create trigger trg_orders_fill_order_number
  before insert on public.orders
  for each row execute function public.orders_fill_order_number();

-- Pickup code: 6 chars, unambiguous alphabet, retry until unique
create or replace function public.generate_pickup_code()
returns text language plpgsql as $$
declare
  alphabet text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code text;
  i int;
  retries int := 0;
begin
  loop
    code := '';
    for i in 1..6 loop
      code := code || substr(alphabet, 1 + (floor(random() * length(alphabet)))::int, 1);
    end loop;
    exit when not exists (select 1 from public.orders where pickup_code = code);
    retries := retries + 1;
    if retries > 10 then
      raise exception 'Could not generate unique pickup code';
    end if;
  end loop;
  return code;
end;
$$;

------------------------------------------------------------------------
-- 7. Rating aggregation view
------------------------------------------------------------------------
create or replace view public.hotel_rating_stats as
select
  h.id as hotel_id,
  coalesce(round(avg(r.rating)::numeric, 2), 0) as average_rating,
  count(r.id)                                   as review_count
from public.hotels h
left join public.reviews r on r.hotel_id = h.id
group by h.id;

------------------------------------------------------------------------
-- 8. Transactional RPCs
--   These MUST be SECURITY DEFINER because they touch multiple
--   tables atomically and are called from the app via supabase.rpc().
--   Authorization is checked inside the functions.
------------------------------------------------------------------------

-- 8.1 create_order ----------------------------------------------------
create type public.order_item_input as (
  listing_id uuid,
  quantity   int
);

create or replace function public.create_order(
  p_customer_id     uuid,
  p_hotel_id        uuid,
  p_items           public.order_item_input[],
  p_idempotency_key text    default null,
  p_customer_note   text    default null,
  p_service_fee     numeric default 0
) returns public.orders
language plpgsql security definer set search_path = public as $$
declare
  v_order      public.orders%rowtype;
  v_item       public.order_item_input;
  v_listing    public.listings%rowtype;
  v_subtotal   numeric(10,2) := 0;
  v_commission numeric(5,2);
  v_line_total numeric(10,2);
begin
  -- Only the signed-in user may place their own order
  if auth.uid() is null or auth.uid() <> p_customer_id then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  -- Idempotency
  if p_idempotency_key is not null then
    select * into v_order from public.orders where idempotency_key = p_idempotency_key;
    if found then return v_order; end if;
  end if;

  -- Pin commission rate for this purchase
  select commission_rate into v_commission
    from public.hotels
    where id = p_hotel_id and status = 'approved';
  if not found then
    raise exception 'hotel_not_found_or_not_approved' using errcode = 'P0001';
  end if;

  insert into public.orders (
    customer_id, hotel_id, subtotal, service_fee, total,
    idempotency_key, customer_note, status
  ) values (
    p_customer_id, p_hotel_id, 0, p_service_fee, 0,
    p_idempotency_key, p_customer_note, 'pending_payment'
  ) returning * into v_order;

  -- Iterate items with row-level lock to prevent overselling
  foreach v_item in array p_items loop
    select * into v_listing
      from public.listings
      where id = v_item.listing_id and hotel_id = p_hotel_id
      for update;

    if not found then
      raise exception 'listing_not_found_%', v_item.listing_id using errcode = 'P0002';
    end if;
    if v_listing.status <> 'active' then
      raise exception 'listing_not_active_%', v_item.listing_id using errcode = 'P0003';
    end if;
    if v_listing.available_quantity < v_item.quantity then
      raise exception 'insufficient_stock_%', v_item.listing_id using errcode = 'P0004';
    end if;
    if v_listing.pickup_end_at <= now() then
      raise exception 'pickup_window_passed_%', v_item.listing_id using errcode = 'P0005';
    end if;

    v_line_total := v_listing.discounted_price * v_item.quantity;
    v_subtotal   := v_subtotal + v_line_total;

    insert into public.order_items (
      order_id, listing_id, title, unit_price, original_unit_price, quantity, line_total
    ) values (
      v_order.id, v_listing.id, v_listing.title,
      v_listing.discounted_price, v_listing.original_price,
      v_item.quantity, v_line_total
    );

    update public.listings
       set available_quantity = available_quantity - v_item.quantity,
           status = case
             when available_quantity - v_item.quantity = 0 then 'sold_out'::listing_status
             else status
           end
     where id = v_listing.id;
  end loop;

  update public.orders
     set subtotal          = v_subtotal,
         total             = v_subtotal + coalesce(p_service_fee, 0),
         commission_amount = round(v_subtotal * v_commission / 100, 2),
         hotel_payout      = v_subtotal - round(v_subtotal * v_commission / 100, 2)
   where id = v_order.id
   returning * into v_order;

  return v_order;
end;
$$;

-- 8.2 mark_order_paid --------------------------------------------------
--   Called by the server (service role) after verifying a webhook.
create or replace function public.mark_order_paid(
  p_order_id        uuid,
  p_pickup_code_ttl interval default '24 hours'
) returns public.orders
language plpgsql security definer set search_path = public as $$
declare v_order public.orders%rowtype;
begin
  update public.orders
     set status                 = 'paid',
         pickup_code            = coalesce(pickup_code, public.generate_pickup_code()),
         pickup_code_expires_at = coalesce(pickup_code_expires_at, now() + p_pickup_code_ttl)
   where id = p_order_id and status = 'pending_payment'
   returning * into v_order;

  if not found then
    -- Idempotent: if already paid, just return current row
    select * into v_order from public.orders where id = p_order_id;
    return v_order;
  end if;

  insert into public.notifications (user_id, type, title, body, data)
  values (
    v_order.customer_id,
    'order_paid',
    'Siparişin onaylandı',
    'Teslim kodun: ' || v_order.pickup_code,
    jsonb_build_object('order_id', v_order.id, 'order_number', v_order.order_number)
  );

  return v_order;
end;
$$;

-- 8.3 verify_pickup ----------------------------------------------------
create or replace function public.verify_pickup(
  p_hotel_id   uuid,
  p_code       text,
  p_scanned_by uuid
) returns public.orders
language plpgsql security definer set search_path = public as $$
declare v_order public.orders%rowtype;
begin
  -- Only hotel staff/owner or admin may verify
  if not (public.is_member_of_hotel(p_hotel_id) or public.is_admin()) then
    raise exception 'unauthorized' using errcode = '42501';
  end if;

  select * into v_order
    from public.orders
   where hotel_id    = p_hotel_id
     and pickup_code = upper(p_code)
     and status in ('paid','ready_for_pickup')
   for update;

  if not found then
    raise exception 'pickup_invalid' using errcode = 'P0010';
  end if;
  if v_order.pickup_code_expires_at is not null
     and v_order.pickup_code_expires_at < now() then
    raise exception 'pickup_expired' using errcode = 'P0011';
  end if;

  update public.orders
     set status               = 'completed',
         picked_up_at         = now(),
         picked_up_by_user_id = p_scanned_by
   where id = v_order.id
   returning * into v_order;

  insert into public.notifications (user_id, type, title, body, data)
  values (
    v_order.customer_id, 'order_completed',
    'Siparişin teslim edildi',
    'Afiyet olsun!',
    jsonb_build_object('order_id', v_order.id, 'order_number', v_order.order_number)
  );

  return v_order;
end;
$$;

-- Note: the is_member_of_hotel / is_admin helpers are defined in 0002
-- (RLS module). verify_pickup references them; that's fine because
-- function bodies are resolved at call time, not creation time.

-- 8.4 Grants -----------------------------------------------------------
revoke all on function public.create_order(uuid, uuid, public.order_item_input[], text, text, numeric) from public;
revoke all on function public.mark_order_paid(uuid, interval) from public;
revoke all on function public.verify_pickup(uuid, text, uuid) from public;

grant execute on function public.create_order(uuid, uuid, public.order_item_input[], text, text, numeric)
  to authenticated;
grant execute on function public.mark_order_paid(uuid, interval)
  to service_role;
grant execute on function public.verify_pickup(uuid, text, uuid)
  to authenticated;