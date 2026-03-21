
ALTER TABLE public.dsa_questions ADD COLUMN IF NOT EXISTS company_tags text[] DEFAULT '{}';

CREATE TABLE IF NOT EXISTS public.daily_challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id uuid REFERENCES public.dsa_questions(id) ON DELETE CASCADE NOT NULL,
  challenge_date date NOT NULL UNIQUE DEFAULT CURRENT_DATE,
  bonus_xp integer NOT NULL DEFAULT 50,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.daily_challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view daily challenges" ON public.daily_challenges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage daily challenges" ON public.daily_challenges FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'::app_role));
