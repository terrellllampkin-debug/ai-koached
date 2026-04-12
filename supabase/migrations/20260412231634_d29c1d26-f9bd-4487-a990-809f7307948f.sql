-- Add avatar_config JSONB column to profiles for storing 3D avatar customization
ALTER TABLE public.profiles
ADD COLUMN avatar_config jsonb DEFAULT '{}';

-- Add comment for clarity
COMMENT ON COLUMN public.profiles.avatar_config IS 'Stores 3D avatar customization: body_type, skin_tone, hair_style, hair_color, outfit, accessories';