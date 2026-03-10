-- Community Features: Recipe Sharing, Bake Feed, Baker Profiles
-- Migration 007

-- ============================================
-- 1. EXPAND PROFILES — add community fields
-- ============================================
alter table public.profiles add column if not exists bio text;
alter table public.profiles add column if not exists starter_name text;
alter table public.profiles add column if not exists is_public boolean default false;

-- ============================================
-- 2. RECIPE_LIKES — users can like public recipes
-- (recipe_saves is in migration 004 — do NOT recreate)
-- ============================================
create table public.recipe_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(user_id, recipe_id)
);

alter table public.recipe_likes enable row level security;

create policy "Anyone can view recipe likes"
  on public.recipe_likes for select
  using (true);

create policy "Authenticated users can like recipes"
  on public.recipe_likes for insert
  with check (auth.uid() = user_id);

create policy "Users can unlike their own likes"
  on public.recipe_likes for delete
  using (auth.uid() = user_id);

create index idx_recipe_likes_recipe_id on public.recipe_likes(recipe_id);
create index idx_recipe_likes_user_id on public.recipe_likes(user_id);

-- ============================================
-- 3. FOLLOWS — baker-to-baker following
-- ============================================
create table public.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references auth.users(id) on delete cascade not null,
  following_id uuid references auth.users(id) on delete cascade not null,
  created_at timestamptz default now(),
  unique(follower_id, following_id),
  check (follower_id != following_id)
);

alter table public.follows enable row level security;

create policy "Anyone can view follows"
  on public.follows for select
  using (true);

create policy "Authenticated users can follow"
  on public.follows for insert
  with check (auth.uid() = follower_id);

create policy "Users can unfollow"
  on public.follows for delete
  using (auth.uid() = follower_id);

create index idx_follows_follower_id on public.follows(follower_id);
create index idx_follows_following_id on public.follows(following_id);

-- ============================================
-- 4. FEED_POSTS — shared bake logs in community feed
-- ============================================
create table public.feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  bake_log_id uuid references public.bake_logs(id) on delete cascade not null,
  caption text,
  created_at timestamptz default now()
);

alter table public.feed_posts enable row level security;

create policy "Public feed posts are viewable by everyone"
  on public.feed_posts for select
  using (true);

create policy "Users can create their own feed posts"
  on public.feed_posts for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own feed posts"
  on public.feed_posts for delete
  using (auth.uid() = user_id);

create index idx_feed_posts_user_id on public.feed_posts(user_id);
create index idx_feed_posts_created_at on public.feed_posts(created_at desc);
create index idx_feed_posts_bake_log_id on public.feed_posts(bake_log_id);

-- ============================================
-- 5. FEED_COMMENTS — comments on feed posts
-- ============================================
create table public.feed_comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.feed_posts(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  content text not null check (char_length(content) > 0 and char_length(content) <= 500),
  created_at timestamptz default now()
);

alter table public.feed_comments enable row level security;

create policy "Anyone can view comments"
  on public.feed_comments for select
  using (true);

create policy "Authenticated users can comment"
  on public.feed_comments for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own comments"
  on public.feed_comments for delete
  using (auth.uid() = user_id);

create index idx_feed_comments_post_id on public.feed_comments(post_id);
create index idx_feed_comments_user_id on public.feed_comments(user_id);

-- ============================================
-- 6. ADD is_shared TO BAKE_LOGS for feed tracking
-- ============================================
alter table public.bake_logs add column if not exists is_shared boolean default false;

-- Allow public read of shared bake logs (for feed posts)
create policy "Shared bake logs are viewable by everyone"
  on public.bake_logs for select
  using (is_shared = true);
