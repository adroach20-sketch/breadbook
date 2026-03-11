-- Default new profiles to public (instead of private)
ALTER TABLE public.profiles ALTER COLUMN is_public SET DEFAULT true;

-- Flip all existing profiles to public
UPDATE public.profiles SET is_public = true WHERE is_public = false;
