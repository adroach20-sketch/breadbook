-- Add feed_speed column to bake_schedules
-- Stores the user's chosen feed timing: 'overnight' (1:5:5 ratio) or 'same_day' (1:1:1 ratio)
-- Nullable because it only applies when starter_status is 'needs_feed' or 'neglected'

alter table public.bake_schedules
  add column feed_speed text;

-- Update starter_status comment to reflect new 3-value enum
comment on column public.bake_schedules.starter_status is 'ready | needs_feed | neglected';
comment on column public.bake_schedules.feed_speed is 'overnight | same_day — only set when starter needs feeding';
