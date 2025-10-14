-- Ensure profiles table exists and carries roles
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'user',
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);
alter table public.profiles enable row level security;

-- Users can read/insert/update their own profile
do $$ begin
  create policy if not exists "profiles read own" on public.profiles
    for select using (auth.uid() = id);
  create policy if not exists "profiles insert own" on public.profiles
    for insert with check (auth.uid() = id);
  create policy if not exists "profiles update own" on public.profiles
    for update using (auth.uid() = id);
exception when duplicate_object then null; end $$;

-- Helper predicate to check admin
create or replace function public.is_admin(uid uuid)
returns boolean
language sql
stable
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = uid and p.role = 'admin'
  );
$$;

-- === ADMIN STATS RPC (bypasses RLS safely, admin-gated) ===
create or replace function public.admin_dashboard_stats()
returns table (
  total_bookings bigint,
  pending bigint,
  successful_payments bigint,
  active_cleaners bigint,
  total_revenue numeric
)
language sql
security definer
set search_path = public
as $$
  -- Guard: only admins may get results
  select
    (select count(*) from public.bookings) as total_bookings,
    (select count(*) from public.bookings where status = 'pending') as pending,
    (select count(*) from public.payments where status in ('successful','paid')) as successful_payments,
    (select count(*) from public.cleaners where is_active = true) as active_cleaners,
    coalesce((select sum(amount) from public.payments where status in ('successful','paid')), 0) as total_revenue
  where public.is_admin(auth.uid());
$$;

revoke all on function public.admin_dashboard_stats() from public;
grant execute on function public.admin_dashboard_stats() to anon, authenticated;

-- OPTIONAL: admin read-all policies so table views also load
do $$ begin
  create policy if not exists "bookings admin or owner can read" on public.bookings
    for select using (
      public.is_admin(auth.uid()) or auth.uid() = user_id or auth.uid() = cleaner_id
    );
  create policy if not exists "payments admin or owner can read" on public.payments
    for select using (
      public.is_admin(auth.uid()) or auth.uid() = user_id
    );
  create policy if not exists "cleaners admin can read" on public.cleaners
    for select using (public.is_admin(auth.uid()));
exception when undefined_table then
  -- If tables don't exist yet, skip; we'll re-run later.
  null;
end $$;
