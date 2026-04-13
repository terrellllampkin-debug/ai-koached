
-- Business Profiles (public directory)
CREATE TABLE public.business_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  business_name TEXT NOT NULL,
  description TEXT,
  country TEXT NOT NULL DEFAULT 'US',
  city TEXT,
  industry TEXT,
  services_offered TEXT[],
  website_url TEXT,
  logo_url TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business profiles viewable by everyone" ON public.business_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own business profile" ON public.business_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own business profile" ON public.business_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own business profile" ON public.business_profiles FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_business_profiles_updated_at BEFORE UPDATE ON public.business_profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Business Listings (products & services)
CREATE TABLE public.business_listings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  price NUMERIC(10,2),
  currency TEXT NOT NULL DEFAULT 'USD',
  category TEXT,
  listing_type TEXT NOT NULL DEFAULT 'service' CHECK (listing_type IN ('product', 'service')),
  images TEXT[],
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.business_listings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active listings viewable by everyone" ON public.business_listings FOR SELECT USING (true);
CREATE POLICY "Users can insert own listings" ON public.business_listings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own listings" ON public.business_listings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own listings" ON public.business_listings FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_business_listings_updated_at BEFORE UPDATE ON public.business_listings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Business Reviews (B2B ratings)
CREATE TABLE public.business_reviews (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  business_profile_id UUID NOT NULL REFERENCES public.business_profiles(id) ON DELETE CASCADE,
  reviewer_user_id UUID NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(business_profile_id, reviewer_user_id)
);

ALTER TABLE public.business_reviews ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reviews viewable by everyone" ON public.business_reviews FOR SELECT USING (true);
CREATE POLICY "Authenticated users can write reviews" ON public.business_reviews FOR INSERT WITH CHECK (auth.uid() = reviewer_user_id);
CREATE POLICY "Reviewers can update own reviews" ON public.business_reviews FOR UPDATE USING (auth.uid() = reviewer_user_id);
CREATE POLICY "Reviewers can delete own reviews" ON public.business_reviews FOR DELETE USING (auth.uid() = reviewer_user_id);

CREATE TRIGGER update_business_reviews_updated_at BEFORE UPDATE ON public.business_reviews FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
