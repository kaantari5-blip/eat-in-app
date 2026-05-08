-- =====================================================================
-- Eat In — 0005 : Auth / role-promotion triggers
--
-- Promotes profiles.role from 'customer' → 'hotel_owner' the instant an
-- admin approves the user's hotel. Runs in the same transaction as the
-- status change, so it can never get out of sync.
-- =====================================================================

create or replace function public.promote_owner_on_hotel_approval()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'approved'
     and (tg_op = 'INSERT' or old.status is distinct from 'approved') then

    new.approved_at := coalesce(new.approved_at, now());

    update public.profiles
       set role = 'hotel_owner'
     where id = new.owner_id
       and role = 'customer';

    insert into public.notifications (user_id, type, title, body, data)
    values (
      new.owner_id,
      'hotel_approved',
      'Oteliniz onaylandı',
      'Oteliniz "' || new.name || '" artık yayında.',
      jsonb_build_object('hotel_id', new.id, 'slug', new.slug)
    );

  elsif new.status = 'rejected'
        and (tg_op = 'INSERT' or old.status is distinct from 'rejected') then
    insert into public.notifications (user_id, type, title, body, data)
    values (
      new.owner_id,
      'hotel_rejected',
      'Otel başvurunuz reddedildi',
      coalesce(new.rejected_reason, 'Detaylar için destek ekibiyle iletişime geçebilirsiniz.'),
      jsonb_build_object('hotel_id', new.id)
    );

  elsif new.status = 'suspended'
        and old.status is distinct from 'suspended' then
    insert into public.notifications (user_id, type, title, body, data)
    values (
      new.owner_id,
      'hotel_suspended',
      'Oteliniz askıya alındı',
      coalesce(new.suspended_reason, 'Hesabınız incelemeye alındı.'),
      jsonb_build_object('hotel_id', new.id)
    );
  end if;

  return new;
end;
$$;

drop trigger if exists trg_hotels_status_change on public.hotels;
create trigger trg_hotels_status_change
  before insert or update of status on public.hotels
  for each row execute function public.promote_owner_on_hotel_approval();

-- Promote a user to hotel_staff when added to a hotel.
create or replace function public.promote_staff_on_assignment()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  update public.profiles
     set role = 'hotel_staff'
   where id = new.user_id
     and role = 'customer';
  return new;
end;
$$;

drop trigger if exists trg_hotel_staff_promote on public.hotel_staff;
create trigger trg_hotel_staff_promote
  after insert on public.hotel_staff
  for each row execute function public.promote_staff_on_assignment();