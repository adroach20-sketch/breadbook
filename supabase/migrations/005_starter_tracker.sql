-- Starter Tracker: starters, starter_logs, starter_schedules tables
-- Features 2.1 (Starter Tracker) and 2.2 (Starter Feeding Plan)

-- ============================================
-- 1. STARTERS -- user sourdough starters
-- ============================================
create table public.starters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  flour_type text default 'all-purpose',
  hydration_ratio integer default 100,
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: users can only access their own starters
alter table public.starters enable row level security;

create policy "Users can view their own starters"
  on public.starters for select using (auth.uid() = user_id);

create policy "Users can insert their own starters"
  on public.starters for insert with check (auth.uid() = user_id);

create policy "Users can update their own starters"
  on public.starters for update using (auth.uid() = user_id);

create policy "Users can delete their own starters"
  on public.starters for delete using (auth.uid() = user_id);

-- Indexes
create index idx_starters_user_id on public.starters(user_id);

-- ============================================
-- 2. STARTER_LOGS -- feeding log entries
-- ============================================
create table public.starter_logs (
  id uuid primary key default gen_random_uuid(),
  starter_id uuid references public.starters(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  fed_at timestamptz default now(),
  water_g numeric,
  flour_g numeric,
  temperature_f numeric,
  peak_rise_pct integer,
  peak_rise_minutes integer,
  notes text,
  photo_url text,
  is_quick_log boolean default false,
  created_at timestamptz default now()
);

-- RLS: users can only access their own starter logs
alter table public.starter_logs enable row level security;

create policy "Users can view their own starter logs"
  on public.starter_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own starter logs"
  on public.starter_logs for insert with check (auth.uid() = user_id);

create policy "Users can update their own starter logs"
  on public.starter_logs for update using (auth.uid() = user_id);

create policy "Users can delete their own starter logs"
  on public.starter_logs for delete using (auth.uid() = user_id);

-- Indexes
create index idx_starter_logs_starter_id on public.starter_logs(starter_id);
create index idx_starter_logs_user_id on public.starter_logs(user_id);
create index idx_starter_logs_fed_at on public.starter_logs(fed_at desc);

-- ============================================
-- 3. STARTER_SCHEDULES -- repeating feed schedules and bake-linked plans
-- ============================================
create table public.starter_schedules (
  id uuid primary key default gen_random_uuid(),
  starter_id uuid references public.starters(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  schedule_type text not null default 'repeating', -- 'repeating' | 'bake_linked'
  interval_hours integer default 12,
  preferred_times jsonb default '[]'::jsonb, -- array of "HH:MM" strings
  bake_recipe_id uuid references public.recipes(id) on delete set null,
  bake_target_time timestamptz,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: users can only access their own schedules
alter table public.starter_schedules enable row level security;

create policy "Users can view their own starter schedules"
  on public.starter_schedules for select using (auth.uid() = user_id);

create policy "Users can insert their own starter schedules"
  on public.starter_schedules for insert with check (auth.uid() = user_id);

create policy "Users can update their own starter schedules"
  on public.starter_schedules for update using (auth.uid() = user_id);

create policy "Users can delete their own starter schedules"
  on public.starter_schedules for delete using (auth.uid() = user_id);

-- Indexes
create index idx_starter_schedules_starter_id on public.starter_schedules(starter_id);
create index idx_starter_schedules_user_id on public.starter_schedules(user_id);
create index idx_starter_schedules_active on public.starter_schedules(is_active) where is_active = true;
