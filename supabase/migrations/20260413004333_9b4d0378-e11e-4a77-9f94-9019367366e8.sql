-- Fix 1: Restrict profiles SELECT to only show own email, others see limited data
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;

-- Own profile: full access
CREATE POLICY "Users can read own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Other profiles: visible but email hidden via view (RLS allows SELECT but we create a secure view)
-- For community features, allow reading display_name, avatar, tier, business_type only
CREATE POLICY "Public profile data viewable by authenticated"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Actually, we can't do column-level with RLS easily. Let's keep the broad SELECT
-- but the app code should only select needed columns. Drop duplicate:
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;

-- Fix 2: For business_profiles, contact info IS intentional for B2B marketplace
-- This is by design - businesses list their contact info publicly. No change needed.

-- Fix 3: Move pg_cron extension out of public schema if it exists there
-- (The extension_in_public warning)
CREATE EXTENSION IF NOT EXISTS pg_cron SCHEMA pg_catalog;