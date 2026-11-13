create extension if not exists pgcrypto;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text not null,
  last_name text not null,
  national_id text not null unique,
  email text not null,
  phone text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.businesses (
  id uuid primary key default gen_random_uuid(),
  owner_user_id uuid not null unique references public.profiles(id) on delete cascade,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  is_registered_company boolean not null default false,
  rif text,
  has_physical_address boolean not null default false,
  address text,
  delivery_available boolean not null default false,
  delivery_phone text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint rif_required_for_registered_company check (not is_registered_company or nullif(trim(rif), '') is not null),
  constraint address_required_when_physical check (not has_physical_address or nullif(trim(address), '') is not null),
  constraint delivery_phone_required check (not delivery_available or nullif(trim(delivery_phone), '') is not null)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null unique references public.businesses(id) on delete cascade,
  plan_code text not null default 'baker_monthly',
  status text not null default 'trialing' check (status in ('trialing','pending_payment','active','past_due','paused','expired')),
  trial_started_at timestamptz not null default now(),
  trial_ends_at timestamptz not null default (now() + interval '7 days'),
  current_period_ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.exchange_rates (
  id uuid primary key default gen_random_uuid(),
  currency text not null check (currency in ('USD','EUR','USDT')),
  rate_ves numeric(20,6) not null check (rate_ves > 0),
  effective_date date not null,
  source text not null,
  fetched_at timestamptz not null default now(),
  unique(currency, effective_date, source)
);

create index exchange_rates_currency_date_idx on public.exchange_rates(currency, effective_date desc);

alter table public.profiles enable row level security;
alter table public.businesses enable row level security;
alter table public.subscriptions enable row level security;
alter table public.exchange_rates enable row level security;

create policy "profiles_read_own" on public.profiles
  for select to authenticated using (id = (select auth.uid()));

create policy "business_owner_read" on public.businesses
  for select to authenticated using (owner_user_id = (select auth.uid()));
create policy "business_owner_update" on public.businesses
  for update to authenticated using (owner_user_id = (select auth.uid()))
  with check (owner_user_id = (select auth.uid()));

create policy "subscription_owner_read" on public.subscriptions
  for select to authenticated using (
    exists (select 1 from public.businesses b where b.id = business_id and b.owner_user_id = (select auth.uid()))
  );

create policy "authenticated_read_rates" on public.exchange_rates
  for select to authenticated using (true);

revoke all on public.profiles from anon, authenticated;
revoke all on public.businesses from anon, authenticated;
revoke all on public.subscriptions from anon, authenticated;
revoke all on public.exchange_rates from anon, authenticated;
grant select on public.profiles, public.businesses, public.subscriptions to authenticated;
grant update (name, is_registered_company, rif, has_physical_address, address, delivery_available, delivery_phone, updated_at)
  on public.businesses to authenticated;
grant select on public.exchange_rates to authenticated;

create or replace function public.complete_baker_registration(
  p_profile jsonb,
  p_business jsonb
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_user_id uuid := auth.uid();
  v_business_id uuid;
  v_slug text;
begin
  if v_user_id is null then
    raise exception 'Debes verificar tu cuenta antes de completar el registro.' using errcode = '28000';
  end if;
  if exists (select 1 from public.profiles where id = v_user_id) then
    raise exception 'Este registro ya fue completado.' using errcode = '23505';
  end if;
  if nullif(trim(p_profile->>'first_name'), '') is null
     or nullif(trim(p_profile->>'last_name'), '') is null
     or nullif(trim(p_profile->>'national_id'), '') is null
     or nullif(trim(p_profile->>'email'), '') is null
     or nullif(trim(p_profile->>'phone'), '') is null
     or nullif(trim(p_business->>'name'), '') is null then
    raise exception 'Completa los datos obligatorios del registro.' using errcode = '22023';
  end if;
  v_slug := trim(both '-' from regexp_replace(
    regexp_replace(translate(lower(trim(p_business->>'name')), 'áéíóúüñ', 'aeiouun'), '[^a-z0-9]+', '-', 'g'),
    '-+', '-', 'g'
  ));
  if v_slug = '' or length(v_slug) < 2 then
    raise exception 'El nombre del negocio no permite crear un enlace válido.' using errcode = '22023';
  end if;
  insert into public.profiles(id, first_name, last_name, national_id, email, phone)
  values (v_user_id, trim(p_profile->>'first_name'), trim(p_profile->>'last_name'), trim(p_profile->>'national_id'), lower(trim(p_profile->>'email')), trim(p_profile->>'phone'));
  insert into public.businesses(owner_user_id, name, slug, is_registered_company, rif, has_physical_address, address, delivery_available, delivery_phone)
  values (
    v_user_id,
    trim(p_business->>'name'),
    v_slug,
    coalesce((p_business->>'is_registered_company')::boolean, false),
    nullif(trim(p_business->>'rif'), ''),
    coalesce((p_business->>'has_physical_address')::boolean, false),
    nullif(trim(p_business->>'address'), ''),
    coalesce((p_business->>'delivery_available')::boolean, false),
    nullif(trim(p_business->>'delivery_phone'), '')
  ) returning id into v_business_id;
  insert into public.subscriptions(business_id) values (v_business_id);
  return v_business_id;
end;
$$;

revoke all on function public.complete_baker_registration(jsonb, jsonb) from public, anon;
grant execute on function public.complete_baker_registration(jsonb, jsonb) to authenticated;
