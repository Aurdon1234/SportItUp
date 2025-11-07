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

-- Basic RLS: allow inserts via authenticated service (server route uses service role).
alter table public.bookings enable row level security;

-- Optional policies if you later want anon read (disabled by default here).
-- create policy "Allow public read"
-- on public.bookings for select
-- to anon
-- using (true);
