-- BreadBook v0.1 Database Schema
-- Run this in Supabase SQL Editor after creating your project.

-- ============================================
-- 1. PROFILES — extends Supabase auth.users
-- ============================================
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique,
  avatar_url text,
  created_at timestamptz default now()
);

-- Auto-create a profile when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, new.raw_user_meta_data->>'username');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS: users can read all profiles, update only their own
alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select
  using (true);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- ============================================
-- 2. RECIPES — the core content table
-- ============================================
create table public.recipes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  description text,
  category text not null,
  ferment_type text not null,
  hydration_pct integer,
  yield_amount text,
  ingredients jsonb not null default '[]'::jsonb,
  steps jsonb not null default '[]'::jsonb,
  tags text[] default '{}',
  is_public boolean default false,
  is_breadbook_original boolean default false,
  source_credit text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: anyone can read public recipes, users can CRUD their own
alter table public.recipes enable row level security;

create policy "Public recipes are viewable by everyone"
  on public.recipes for select
  using (is_public = true);

create policy "Users can view their own recipes"
  on public.recipes for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recipes"
  on public.recipes for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recipes"
  on public.recipes for update
  using (auth.uid() = user_id);

create policy "Users can delete their own recipes"
  on public.recipes for delete
  using (auth.uid() = user_id);

-- ============================================
-- 3. BAKE_SESSIONS — basic usage tracking
-- ============================================
create table public.bake_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete set null,
  started_at timestamptz default now(),
  completed_at timestamptz,
  is_active boolean default true
);

-- RLS: users can only see and manage their own bake sessions
alter table public.bake_sessions enable row level security;

create policy "Users can view their own bake sessions"
  on public.bake_sessions for select
  using (auth.uid() = user_id);

create policy "Users can insert their own bake sessions"
  on public.bake_sessions for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own bake sessions"
  on public.bake_sessions for update
  using (auth.uid() = user_id);

-- ============================================
-- 4. INDEXES for common queries
-- ============================================
create index idx_recipes_user_id on public.recipes(user_id);
create index idx_recipes_category on public.recipes(category);
create index idx_recipes_is_public on public.recipes(is_public) where is_public = true;
create index idx_recipes_is_original on public.recipes(is_breadbook_original) where is_breadbook_original = true;
create index idx_bake_sessions_user_id on public.bake_sessions(user_id);
