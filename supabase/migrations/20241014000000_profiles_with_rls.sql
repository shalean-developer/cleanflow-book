-- Migration: Profiles table with RLS and automatic user creation trigger
-- This ensures every authenticated user has a profile with a default role

-- Create profiles table if it doesn't exist
create table if not exists public.profiles (
  id uuid primary key references auth.users on delete cascade,
  role text not null default 'customer',
  full_name text,
  avatar_url text,
  updated_at timestamptz default now()
);

-- Enable Row Level Security
alter table public.profiles enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Users can read own profile" on public.profiles;
drop policy if exists "Users can update own profile" on public.profiles;
drop policy if exists "Users can insert own profile" on public.profiles;

-- Create RLS policies
create policy "Users can read own profile"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles
  for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles
  for insert
  with check (auth.uid() = id);

-- Function to automatically create profile for new users
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.profiles (id, role)
  values (new.id, 'customer')
  on conflict (id) do nothing;
  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger to call function on user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Backfill: Create profiles for any existing users without profiles
insert into public.profiles (id, role)
select id, 'customer'
from auth.users
where id not in (select id from public.profiles)
on conflict (id) do nothing;

-- Add index for better performance
create index if not exists idx_profiles_role on public.profiles(role);

