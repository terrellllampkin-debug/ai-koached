-- Daily intel table for AI-curated business updates
CREATE TABLE public.business_intel (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  source_url TEXT,
  relevance_score INTEGER DEFAULT 5,
  intel_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.business_intel ENABLE ROW LEVEL SECURITY;

-- Everyone can read intel
CREATE POLICY "Intel viewable by authenticated users"
  ON public.business_intel
  FOR SELECT
  TO authenticated
  USING (true);

-- Index for fast date lookups
CREATE INDEX idx_business_intel_date ON public.business_intel (intel_date DESC);
CREATE INDEX idx_business_intel_category ON public.business_intel (category);