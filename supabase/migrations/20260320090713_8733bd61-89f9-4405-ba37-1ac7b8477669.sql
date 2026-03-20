
-- Streaks table
CREATE TABLE public.streaks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  current_streak INTEGER NOT NULL DEFAULT 0,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.streaks ENABLE ROW LEVEL SECURITY;
CREATE UNIQUE INDEX streaks_user_id_idx ON public.streaks(user_id);
CREATE POLICY "Users can view own streak" ON public.streaks FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can upsert own streak" ON public.streaks FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own streak" ON public.streaks FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all streaks" ON public.streaks FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Battles table
CREATE TABLE public.battles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  challenger_id UUID NOT NULL,
  opponent_id UUID,
  question_id UUID REFERENCES public.dsa_questions(id),
  status TEXT NOT NULL DEFAULT 'waiting',
  winner_id UUID,
  challenger_code TEXT,
  opponent_code TEXT,
  challenger_score INTEGER DEFAULT 0,
  opponent_score INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.battles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view battles" ON public.battles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create battles" ON public.battles FOR INSERT TO authenticated WITH CHECK (auth.uid() = challenger_id);
CREATE POLICY "Participants can update battles" ON public.battles FOR UPDATE TO authenticated USING (auth.uid() = challenger_id OR auth.uid() = opponent_id);

-- Forum posts
CREATE TABLE public.forum_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL,
  question_id UUID REFERENCES public.dsa_questions(id),
  category TEXT NOT NULL DEFAULT 'general',
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view posts" ON public.forum_posts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create posts" ON public.forum_posts FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON public.forum_posts FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own posts" ON public.forum_posts FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage posts" ON public.forum_posts FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Forum replies
CREATE TABLE public.forum_replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID NOT NULL REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  content TEXT NOT NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.forum_replies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view replies" ON public.forum_replies FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create replies" ON public.forum_replies FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own replies" ON public.forum_replies FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage replies" ON public.forum_replies FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Forum upvotes tracking
CREATE TABLE public.forum_upvotes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.forum_replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, reply_id)
);
ALTER TABLE public.forum_upvotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view upvotes" ON public.forum_upvotes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can upvote" ON public.forum_upvotes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove own upvotes" ON public.forum_upvotes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Teams
CREATE TABLE public.teams (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view teams" ON public.teams FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can create teams" ON public.teams FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Creator can update team" ON public.teams FOR UPDATE TO authenticated USING (auth.uid() = created_by);
CREATE POLICY "Admins can manage teams" ON public.teams FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Team members
CREATE TABLE public.team_members (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES public.teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'member',
  joined_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(team_id, user_id)
);
ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view team members" ON public.team_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can join teams" ON public.team_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can leave teams" ON public.team_members FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage team members" ON public.team_members FOR ALL TO authenticated USING (has_role(auth.uid(), 'admin'));

-- Cheat logs
CREATE TABLE public.cheat_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  details JSONB DEFAULT '{}'::jsonb,
  page TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.cheat_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view cheat logs" ON public.cheat_logs FOR SELECT TO authenticated USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can insert own cheat logs" ON public.cheat_logs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Add GitHub, skills, branch to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS github_username TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS skills TEXT[] DEFAULT '{}'::TEXT[];
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS branch TEXT;

-- Enable realtime for battles
ALTER PUBLICATION supabase_realtime ADD TABLE public.battles;
ALTER PUBLICATION supabase_realtime ADD TABLE public.forum_posts;
