-- Create enums
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
CREATE TYPE public.membership_tier AS ENUM ('free', 'starter', 'builder', 'empire', 'dynasty');
CREATE TYPE public.office_level AS ENUM ('starter_desk', 'corner_office', 'penthouse', 'skyscraper', 'empire_tower');

-- Timestamp trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- ============ TABLES FIRST ============

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  email TEXT,
  avatar_url TEXT,
  avatar_glb_url TEXT,
  bio TEXT,
  business_type TEXT,
  tier membership_tier NOT NULL DEFAULT 'free',
  office office_level NOT NULL DEFAULT 'starter_desk',
  onboarding_complete BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.koach_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  balance INTEGER NOT NULL DEFAULT 500,
  lifetime_earned INTEGER NOT NULL DEFAULT 500,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.koach_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  source TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.milestones (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  milestone_key TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  koach_reward INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.user_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, achievement_id)
);

CREATE TABLE public.entities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  state TEXT,
  ein TEXT,
  status TEXT NOT NULL DEFAULT 'planned',
  formed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.credit_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  credit_limit INTEGER,
  balance INTEGER DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.watchlists (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  symbol TEXT NOT NULL,
  asset_type TEXT NOT NULL,
  added_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, symbol)
);

CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agent TEXT NOT NULL,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============ FUNCTIONS (after tables exist) ============

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- ============ RLS ============

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.koach_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.koach_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credit_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can read all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own balance" ON public.koach_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own balance" ON public.koach_balances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own balance" ON public.koach_balances FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own transactions" ON public.koach_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own transactions" ON public.koach_transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own milestones" ON public.milestones FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own milestones" ON public.milestones FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own milestones" ON public.milestones FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);

CREATE POLICY "Users can read own achievements" ON public.user_achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON public.user_achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can read own entities" ON public.entities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own entities" ON public.entities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entities" ON public.entities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entities" ON public.entities FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own credit accounts" ON public.credit_accounts FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own credit accounts" ON public.credit_accounts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own credit accounts" ON public.credit_accounts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own credit accounts" ON public.credit_accounts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own watchlist" ON public.watchlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own watchlist" ON public.watchlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own watchlist" ON public.watchlists FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can read own messages" ON public.chat_messages FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============ TRIGGERS ============

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_koach_balances_updated_at BEFORE UPDATE ON public.koach_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_entities_updated_at BEFORE UPDATE ON public.entities FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_credit_accounts_updated_at BEFORE UPDATE ON public.credit_accounts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ AUTO-CREATE ON SIGNUP ============

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, display_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)));
  
  INSERT INTO public.koach_balances (user_id, balance, lifetime_earned)
  VALUES (NEW.id, 500, 500);
  
  INSERT INTO public.koach_transactions (user_id, amount, reason, source)
  VALUES (NEW.id, 500, 'Welcome bonus', 'signup');
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============ INDEXES ============

CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_koach_transactions_user_id ON public.koach_transactions(user_id);
CREATE INDEX idx_milestones_user_id ON public.milestones(user_id);
CREATE INDEX idx_entities_user_id ON public.entities(user_id);
CREATE INDEX idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX idx_chat_messages_agent ON public.chat_messages(agent);
CREATE INDEX idx_watchlists_user_id ON public.watchlists(user_id);

-- ============ SEED ACHIEVEMENTS ============

INSERT INTO public.achievements (key, title, description, icon, koach_reward) VALUES
  ('first_login', 'Welcome to the Empire', 'Logged in for the first time', '🏢', 100),
  ('first_entity', 'Entity Formed', 'Created your first business entity', '🏛️', 500),
  ('first_ein', 'EIN Secured', 'Got your first EIN', '📋', 250),
  ('credit_700', 'Credit Builder', 'Reached 700+ credit score', '💳', 500),
  ('revenue_1k', 'First $1K Month', 'Hit $1,000 in monthly revenue', '💰', 1000),
  ('revenue_5k', '$5K Milestone', 'Hit $5,000 in monthly revenue', '🚀', 2500),
  ('revenue_12k', '$12K Club', 'Hit $12,000 in monthly revenue', '👑', 5000),
  ('ai_chat_10', 'AI Apprentice', 'Had 10 conversations with AI agents', '🤖', 50),
  ('ai_chat_100', 'AI Power User', 'Had 100 conversations with AI agents', '⚡', 500),
  ('watchlist_5', 'Market Watcher', 'Added 5 items to your watchlist', '📊', 100);