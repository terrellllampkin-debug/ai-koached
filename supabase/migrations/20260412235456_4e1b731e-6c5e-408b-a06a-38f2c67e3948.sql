-- Add unique constraint for milestone upsert
ALTER TABLE public.milestones ADD CONSTRAINT milestones_user_id_milestone_key_unique UNIQUE (user_id, milestone_key);