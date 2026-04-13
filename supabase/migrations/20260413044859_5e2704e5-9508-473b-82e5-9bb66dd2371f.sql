
-- Revenue logs table
CREATE TABLE public.revenue_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  amount NUMERIC NOT NULL,
  source TEXT NOT NULL DEFAULT 'manual',
  description TEXT,
  logged_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.revenue_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own revenue" ON public.revenue_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own revenue" ON public.revenue_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own revenue" ON public.revenue_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own revenue" ON public.revenue_logs FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_revenue_logs_updated_at
  BEFORE UPDATE ON public.revenue_logs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for live revenue tracking
ALTER PUBLICATION supabase_realtime ADD TABLE public.revenue_logs;

-- Trial plans table (saves free trial business previews)
CREATE TABLE public.trial_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  business_idea TEXT NOT NULL,
  plan_content TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.trial_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own trial plans" ON public.trial_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone can insert trial plans" ON public.trial_plans FOR INSERT WITH CHECK (true);

-- Enable realtime for koach_balances (live sidebar counter)
ALTER PUBLICATION supabase_realtime ADD TABLE public.koach_balances;
