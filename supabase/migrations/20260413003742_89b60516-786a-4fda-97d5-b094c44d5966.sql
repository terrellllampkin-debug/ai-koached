CREATE TABLE public.compliance_deadlines (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  deadline_date DATE NOT NULL,
  category TEXT NOT NULL DEFAULT 'filing',
  country TEXT NOT NULL DEFAULT 'US',
  is_completed BOOLEAN NOT NULL DEFAULT false,
  reminder_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.compliance_deadlines ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own deadlines" ON public.compliance_deadlines FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own deadlines" ON public.compliance_deadlines FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own deadlines" ON public.compliance_deadlines FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own deadlines" ON public.compliance_deadlines FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_compliance_deadlines_updated_at
BEFORE UPDATE ON public.compliance_deadlines
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();