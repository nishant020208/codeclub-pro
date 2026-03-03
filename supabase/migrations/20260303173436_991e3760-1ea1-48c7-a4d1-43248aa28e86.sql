
-- XP Logs table
CREATE TABLE public.xp_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  amount integer NOT NULL DEFAULT 0,
  reason text NOT NULL,
  metadata jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.xp_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own xp" ON public.xp_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own xp" ON public.xp_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can view all xp" ON public.xp_logs FOR SELECT USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can manage xp" ON public.xp_logs FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Contest submissions
CREATE TABLE public.contest_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  competition_id uuid NOT NULL REFERENCES public.competitions(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  submission_url text,
  github_link text,
  notes text,
  score integer DEFAULT 0,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.contest_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own submissions" ON public.contest_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own submissions" ON public.contest_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins can manage submissions" ON public.contest_submissions FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Anyone can view submissions" ON public.contest_submissions FOR SELECT USING (true);

-- Project likes
CREATE TABLE public.project_likes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);
ALTER TABLE public.project_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view likes" ON public.project_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON public.project_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON public.project_likes FOR DELETE USING (auth.uid() = user_id);

-- Project comments
CREATE TABLE public.project_comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.project_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view comments" ON public.project_comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON public.project_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON public.project_comments FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage comments" ON public.project_comments FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Add columns to competitions
ALTER TABLE public.competitions ADD COLUMN IF NOT EXISTS rules text;
ALTER TABLE public.competitions ADD COLUMN IF NOT EXISTS xp_reward integer DEFAULT 100;
ALTER TABLE public.competitions ADD COLUMN IF NOT EXISTS start_time timestamptz;
ALTER TABLE public.competitions ADD COLUMN IF NOT EXISTS status text DEFAULT 'upcoming';

-- Add columns to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS is_featured boolean DEFAULT false;
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS tech_stack text[] DEFAULT '{}'::text[];
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS likes_count integer DEFAULT 0;
