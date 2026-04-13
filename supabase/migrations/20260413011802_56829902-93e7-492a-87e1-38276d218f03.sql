-- Create storage bucket for credit reports
INSERT INTO storage.buckets (id, name, public) VALUES ('credit-reports', 'credit-reports', false);

-- Storage policies: users can upload/read their own reports only
CREATE POLICY "Users can upload own credit reports"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'credit-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own credit reports"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'credit-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete own credit reports"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'credit-reports' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create dispute letters table
CREATE TABLE public.dispute_letters (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bureau TEXT NOT NULL,
  account_name TEXT NOT NULL,
  error_type TEXT NOT NULL,
  error_description TEXT NOT NULL,
  letter_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.dispute_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own dispute letters"
ON public.dispute_letters FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own dispute letters"
ON public.dispute_letters FOR INSERT TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own dispute letters"
ON public.dispute_letters FOR UPDATE TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own dispute letters"
ON public.dispute_letters FOR DELETE TO authenticated
USING (auth.uid() = user_id);

CREATE TRIGGER update_dispute_letters_updated_at
BEFORE UPDATE ON public.dispute_letters
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();