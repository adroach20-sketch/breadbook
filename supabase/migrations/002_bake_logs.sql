-- Bake Journal: bake_logs table
-- Stores user bake results (rating, notes, photos) linked to recipes and bake sessions

create table public.bake_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_id uuid references public.recipes(id) on delete set null not null,
  bake_session_id uuid references public.bake_sessions(id) on delete set null,
  rating integer not null check (rating >= 1 and rating <= 5),
  crumb_notes text,
  crust_notes text,
  flavor_notes text,
  what_went_well text,
  what_to_change text,
  photo_urls jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: users can only access their own bake logs
alter table public.bake_logs enable row level security;

create policy "Users can view their own bake logs"
  on public.bake_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own bake logs"
  on public.bake_logs for insert with check (auth.uid() = user_id);

create policy "Users can update their own bake logs"
  on public.bake_logs for update using (auth.uid() = user_id);

create policy "Users can delete their own bake logs"
  on public.bake_logs for delete using (auth.uid() = user_id);

-- Indexes for common queries
create index idx_bake_logs_user_id on public.bake_logs(user_id);
create index idx_bake_logs_recipe_id on public.bake_logs(recipe_id);
create index idx_bake_logs_created_at on public.bake_logs(created_at desc);
