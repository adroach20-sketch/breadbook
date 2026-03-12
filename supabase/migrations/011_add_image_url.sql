-- Add image_url column to recipes table (v0.4 recipe photography)
ALTER TABLE public.recipes ADD COLUMN IF NOT EXISTS image_url text;
