CREATE TABLE IF NOT EXISTS public.studio_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  name          text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.studio_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "studio_users_service_only"
  ON public.studio_users FOR ALL
  TO service_role
  USING (true) WITH CHECK (true);
