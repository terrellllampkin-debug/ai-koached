
-- 1. Remove koach_transactions INSERT policy (prevent self-insert)
DROP POLICY IF EXISTS "Users can insert own transactions" ON public.koach_transactions;

-- 2. Remove koach_balances UPDATE policy (prevent self-update)
DROP POLICY IF EXISTS "Users can update own balance" ON public.koach_balances;

-- 3. Remove user_achievements INSERT policy (prevent self-award)
DROP POLICY IF EXISTS "Users can insert own achievements" ON public.user_achievements;

-- 4. Fix profiles: restrict to authenticated only
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Profiles viewable by authenticated users" ON public.profiles
  FOR SELECT TO authenticated USING (true);

-- 5. Fix business_profiles: restrict to authenticated only
DROP POLICY IF EXISTS "Business profiles viewable by everyone" ON public.business_profiles;
CREATE POLICY "Business profiles viewable by authenticated users" ON public.business_profiles
  FOR SELECT TO authenticated USING (true);

-- 6. Fix business_listings: restrict to authenticated only
DROP POLICY IF EXISTS "Active listings viewable by everyone" ON public.business_listings;
CREATE POLICY "Listings viewable by authenticated users" ON public.business_listings
  FOR SELECT TO authenticated USING (true);

-- 7. Fix business_reviews: restrict to authenticated only
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.business_reviews;
CREATE POLICY "Reviews viewable by authenticated users" ON public.business_reviews
  FOR SELECT TO authenticated USING (true);
