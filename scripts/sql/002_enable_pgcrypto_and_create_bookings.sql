create extension if not exists pgcrypto with schema public;

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  phone text not null,
  email text not null,
  turf_id text,
  turf_name text,
  location text,
  date text,
  time_slot text,
  duration_hours numeric,
  total_amount numeric,
  notes text
);

-- Ensure RLS is enabled (service role used by the server routes bypasses RLS)
alter table public.bookings enable row level security;

-- Optional: If you later want public read via anon, add a policy (commented out by default)
-- create policy "Allow public read"
-- on public.bookings for select
-- to anon
-- using (true);
