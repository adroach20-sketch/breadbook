-- Smart Schedule Planner: bake_schedules table
-- Stores reverse-engineered bake timelines generated from recipe + conditions

create table public.bake_schedules (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_id text not null,                    -- supports uuid and bb-* local IDs
  recipe_title text not null,                 -- denormalized for display
  target_eat_time timestamptz not null,
  starter_name text,
  starter_status text not null,               -- 'peak' | 'recently_fed' | 'fed_but_fallen' | 'dormant'
  room_temp_f integer not null default 70,
  fridge_available boolean not null default true,
  schedule_steps jsonb not null default '[]'::jsonb,
  warnings jsonb not null default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS: users can only access their own schedules
alter table public.bake_schedules enable row level security;

create policy "Users can view their own schedules"
  on public.bake_schedules for select
  using (auth.uid() = user_id);

create policy "Users can insert their own schedules"
  on public.bake_schedules for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own schedules"
  on public.bake_schedules for update
  using (auth.uid() = user_id);

create policy "Users can delete their own schedules"
  on public.bake_schedules for delete
  using (auth.uid() = user_id);

-- Indexes
create index idx_bake_schedules_user_id on public.bake_schedules(user_id);
create index idx_bake_schedules_created_at on public.bake_schedules(created_at desc);
