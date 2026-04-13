
-- Add formation_steps JSON to entities
ALTER TABLE public.entities ADD COLUMN IF NOT EXISTS formation_steps jsonb NOT NULL DEFAULT '{}'::jsonb;

-- Create entity_documents table
CREATE TABLE public.entity_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id uuid NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  document_type text NOT NULL,
  document_name text NOT NULL,
  document_content text,
  file_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.entity_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own entity documents"
  ON public.entity_documents FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own entity documents"
  ON public.entity_documents FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own entity documents"
  ON public.entity_documents FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own entity documents"
  ON public.entity_documents FOR DELETE
  USING (auth.uid() = user_id);

CREATE TRIGGER update_entity_documents_updated_at
  BEFORE UPDATE ON public.entity_documents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
