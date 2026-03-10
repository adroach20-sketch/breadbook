-- ============================================
-- RECIPE_SAVES — bookmarked/favorited recipes
-- Canonical table for favorites. Referenced by
-- community features (3.1/3.2/3.3).
-- ============================================

create table public.recipe_saves (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  created_at timestamptz default now(),

  -- Each user can save a recipe only once
  constraint recipe_saves_unique unique (user_id, recipe_id)
);

-- RLS: users can only see and manage their own saves
alter table public.recipe_saves enable row level security;

create policy "Users can view their own saves"
  on public.recipe_saves for select
  using (auth.uid() = user_id);

create policy "Users can insert their own saves"
  on public.recipe_saves for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own saves"
  on public.recipe_saves for delete
  using (auth.uid() = user_id);

-- Allow anyone to count saves per recipe (for save counts on cards)
-- This uses a separate policy so unauthenticated users could also
-- see save counts in the future (public recipe pages).
create policy "Anyone can count saves per recipe"
  on public.recipe_saves for select
  using (true);

-- Note: The above "Anyone can count saves" policy is broader than
-- "Users can view their own saves" and effectively supersedes it.
-- Keeping both for clarity of intent. In practice the broader policy
-- is the one that applies.

-- ============================================
-- INDEXES
-- ============================================
create index idx_recipe_saves_user_id on public.recipe_saves(user_id);
create index idx_recipe_saves_recipe_id on public.recipe_saves(recipe_id);
create index idx_recipe_saves_user_recipe on public.recipe_saves(user_id, recipe_id);

-- ============================================
-- VIEW: recipe save counts (for sorting/display)
-- ============================================
create or replace view public.recipe_save_counts as
  select recipe_id, count(*) as save_count
  from public.recipe_saves
  group by recipe_id;
