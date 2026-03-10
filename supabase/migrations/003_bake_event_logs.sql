-- In-Bake Logging: bake_event_logs table
-- Append-only log of events captured during a guided bake session
-- (fold completions, rise check-ins, room temperature)

create table public.bake_event_logs (
  id uuid primary key default gen_random_uuid(),
  bake_session_id uuid references public.bake_sessions(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  step_index integer not null,
  step_type text not null,
  event_type text not null,       -- 'fold_done' | 'rise_check' | 'room_temp'
  event_value text,               -- '50%' | '72' | null
  created_at timestamptz default now()
);

-- RLS: users can only access their own events (append-only — no update/delete)
alter table public.bake_event_logs enable row level security;

create policy "Users can view their own bake events"
  on public.bake_event_logs for select using (auth.uid() = user_id);

create policy "Users can insert their own bake events"
  on public.bake_event_logs for insert with check (auth.uid() = user_id);

-- Indexes for common queries
create index idx_bake_event_logs_session_id on public.bake_event_logs(bake_session_id);
create index idx_bake_event_logs_user_id on public.bake_event_logs(user_id);
