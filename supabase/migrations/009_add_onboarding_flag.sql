-- Add onboarding tracking to profiles
-- Defaults to false so existing users see onboarding once (a nice tour of features)
ALTER TABLE public.profiles ADD COLUMN has_onboarded boolean DEFAULT false;
