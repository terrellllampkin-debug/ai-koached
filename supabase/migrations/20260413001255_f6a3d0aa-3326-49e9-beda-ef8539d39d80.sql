-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Schedule daily intel generation at 6 AM UTC
SELECT cron.schedule(
  'generate-daily-intel',
  '0 6 * * *',
  $$
  SELECT net.http_post(
    url := 'https://akbktrobxzwwmharmrkd.supabase.co/functions/v1/daily-intel',
    headers := '{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFrYmt0cm9ieHp3d21oYXJtcmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYwMTc0MDUsImV4cCI6MjA5MTU5MzQwNX0.DWUIAxL1qLlBYEYc3HP8h1wTuV82DXqx_HHD7Hn0z3A"}'::jsonb,
    body := '{}'::jsonb
  ) AS request_id;
  $$
);