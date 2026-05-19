-- Ejecuta este script en Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.ratings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  department text not null,
  rating int not null check (rating between 1 and 5),
  comment text not null,
  user_id uuid references auth.users (id) on delete set null,
  user_email text not null,
  user_name text
);

alter table public.ratings alter column user_id drop not null;
alter table public.ratings enable row level security;

drop policy if exists "insert_own_ratings" on public.ratings;
drop policy if exists "public_insert_ratings" on public.ratings;

create policy "public_insert_ratings"
on public.ratings
for insert
to anon, authenticated
with check (true);

drop policy if exists "select_own_ratings" on public.ratings;
