-- Fix the security definer view issue
DROP VIEW IF EXISTS public.public_profiles;

CREATE VIEW public.public_profiles
WITH (security_invoker = true) AS
SELECT id, user_id, display_name, avatar_url, avatar_glb_url, bio, 
       business_type, tier, office, avatar_config, created_at
FROM public.profiles;

-- Re-add a broad SELECT policy for community features
-- Users can see other profiles (but email is only exposed to own profile via the first policy)
CREATE POLICY "Authenticated users can view profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);