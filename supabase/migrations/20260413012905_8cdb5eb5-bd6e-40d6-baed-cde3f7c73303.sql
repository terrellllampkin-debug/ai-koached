
CREATE TABLE public.empire_journey (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  phase text NOT NULL DEFAULT 'discovery',
  current_step integer NOT NULL DEFAULT 1,
  completed_phases text[] NOT NULL DEFAULT '{}',
  agent_notes jsonb NOT NULL DEFAULT '{}'::jsonb,
  next_agent text NOT NULL DEFAULT 'ceo_coach',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

ALTER TABLE public.empire_journey ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own journey" ON public.empire_journey FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own journey" ON public.empire_journey FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own journey" ON public.empire_journey FOR UPDATE USING (auth.uid() = user_id);

CREATE TRIGGER update_empire_journey_updated_at BEFORE UPDATE ON public.empire_journey FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
