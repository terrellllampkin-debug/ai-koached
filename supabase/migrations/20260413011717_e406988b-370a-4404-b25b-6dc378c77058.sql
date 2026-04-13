-- Fix 1: Replace overly permissive profiles SELECT policy
DROP POLICY IF EXISTS "Public profile data viewable by authenticated" ON public.profiles;

-- Own profile: full access
CREATE POLICY "Users can read own full profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Other profiles: only non-sensitive columns via RLS (can't do column-level, 
-- but we create a secure view for community features)
-- Keep a broad SELECT for community but create a view that hides email
CREATE OR REPLACE VIEW public.public_profiles AS
SELECT id, user_id, display_name, avatar_url, avatar_glb_url, bio, 
       business_type, tier, office, avatar_config, created_at
FROM public.profiles;

-- Fix 2: Explicitly deny UPDATE on koach_balances for regular users
-- (There's currently no UPDATE policy, but let's be explicit)
CREATE POLICY "Only service role can update balances"
ON public.koach_balances
FOR UPDATE
TO authenticated
USING (false)
WITH CHECK (false);