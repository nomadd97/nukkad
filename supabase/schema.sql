-- =========================================================
-- Nukkad database (Supabase / Postgres)
-- Run once: Supabase dashboard -> SQL Editor -> New query -> paste -> Run.
-- Then run seed.sql for the demo shops.
--
-- Shape: every collection is a table of (id, data jsonb). The apps read and
-- write whole documents, so adding a field never needs a migration.
-- =========================================================

create extension if not exists pgcrypto with schema extensions;

do $$
declare t text;
begin
  foreach t in array array['shops','products','orders','searches','ratings','offers'] loop
    execute format('create table if not exists public.%I (
      id text primary key,
      data jsonb not null default ''{}''::jsonb,
      updated_at timestamptz not null default now()
    )', 'nk_' || t);
    execute format('alter table public.%I enable row level security', 'nk_' || t);
    -- Demo-grade rules: anyone with the app can read and write documents, nobody can delete.
    -- For production, switch shops to Supabase Auth and limit writes to the shop owner (see README).
    execute format('drop policy if exists "read" on public.%I', 'nk_' || t);
    execute format('drop policy if exists "insert" on public.%I', 'nk_' || t);
    execute format('drop policy if exists "update" on public.%I', 'nk_' || t);
    execute format('create policy "read" on public.%I for select using (true)', 'nk_' || t);
    execute format('create policy "insert" on public.%I for insert with check (true)', 'nk_' || t);
    execute format('create policy "update" on public.%I for update using (true) with check (true)', 'nk_' || t);
  end loop;
end $$;

-- Orders: newest first lookups per shop
create index if not exists nk_orders_shop on public.nk_orders ((data->>'shopId'));
create index if not exists nk_products_shop on public.nk_products ((data->>'shopId'));

-- PINs live in their own table that the app can never read. Only the functions below touch it.
create table if not exists public.nk_pins (
  shop_id text primary key,
  pin_hash text not null
);
alter table public.nk_pins enable row level security;  -- no policies = no direct access at all

-- ---------- Functions the apps call ----------

-- Merge a few fields into a document (e.g. {"status":"ready"}) without overwriting the rest
create or replace function public.nk_patch(t text, doc_id text, patch jsonb)
returns void language plpgsql security definer set search_path = public as $$
begin
  if t not in ('shops','products','orders','searches','ratings','offers') then
    raise exception 'unknown collection %', t;
  end if;
  if patch ? 'pin' then raise exception 'pin cannot be set here'; end if;
  execute format('update public.%I set data = data || $1, updated_at = now() where id = $2', 'nk_' || t) using patch, doc_id;
end $$;

-- Place an order and reduce stock in ONE locked step, so two buyers can never take the last piece.
-- Returns null when the order went through, or a short message saying what was short.
create or replace function public.nk_place_order(doc_id text, body jsonb)
returns text language plpgsql security definer set search_path = public as $$
declare
  it jsonb; prod jsonb; have int;
begin
  if exists (select 1 from nk_orders where id = doc_id) then return null; end if;   -- double tap: already placed
  if coalesce((select (data->>'open')::boolean from nk_shops where id = body->>'shopId'), true) = false then
    return 'This shop is closed right now.';
  end if;
  for it in select * from jsonb_array_elements(body->'items') loop
    select data into prod from nk_products where id = it->>'pid' for update;
    if prod is null then return 'An item is no longer sold here.'; end if;
    have := coalesce((prod->>'stock')::int, 0);
    if have < (it->>'qty')::int then
      return format('Only %s left of %s. Lower the quantity.', have, prod->>'name');
    end if;
  end loop;
  for it in select * from jsonb_array_elements(body->'items') loop
    update nk_products
       set data = jsonb_set(data, '{stock}', to_jsonb(greatest(0, coalesce((data->>'stock')::int, 0) - (it->>'qty')::int))),
           updated_at = now()
     where id = it->>'pid';
  end loop;
  insert into nk_orders (id, data) values (doc_id, body);
  return null;
end $$;

-- Check a shop PIN. The hash never leaves the database.
create or replace function public.nk_login(shop_id text, pin text)
returns boolean language sql security definer set search_path = public, extensions as $$
  select exists (select 1 from nk_pins p where p.shop_id = nk_login.shop_id and p.pin_hash = crypt(nk_login.pin, p.pin_hash));
$$;

-- Set the PIN for a NEW shop. Refuses to overwrite an existing PIN.
create or replace function public.nk_set_pin(shop_id text, pin text)
returns boolean language plpgsql security definer set search_path = public, extensions as $$
begin
  if pin !~ '^\d{4}$' then raise exception 'PIN must be 4 digits'; end if;
  insert into nk_pins (shop_id, pin_hash) values (nk_set_pin.shop_id, crypt(nk_set_pin.pin, gen_salt('bf')))
  on conflict on constraint nk_pins_pkey do nothing;
  return found;
end $$;

revoke all on function public.nk_patch(text, text, jsonb) from public;
revoke all on function public.nk_place_order(text, jsonb) from public;
revoke all on function public.nk_login(text, text) from public;
revoke all on function public.nk_set_pin(text, text) from public;
grant execute on function public.nk_patch(text, text, jsonb) to anon, authenticated;
grant execute on function public.nk_place_order(text, jsonb) to anon, authenticated;
grant execute on function public.nk_login(text, text) to anon, authenticated;
grant execute on function public.nk_set_pin(text, text) to anon, authenticated;

-- ---------- Live updates: new orders ring on the shop phone instantly ----------
do $$
declare t text;
begin
  foreach t in array array['nk_shops','nk_products','nk_orders','nk_searches','nk_ratings','nk_offers'] loop
    begin
      execute format('alter publication supabase_realtime add table public.%I', t);
    exception when duplicate_object then null;
    end;
  end loop;
end $$;
