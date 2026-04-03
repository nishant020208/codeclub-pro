import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: userError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !user) throw new Error("Unauthorized");

    const userId = user.id;

    // Fetch all needed data in parallel
    const [
      { data: allBadges },
      { data: userBadges },
      { data: quizAttempts },
      { data: dsaSubs },
      { data: xpLogs },
      { data: streak },
      { data: courses },
      { data: quizzes },
      { data: allAchievements },
      { data: userAchievements },
    ] = await Promise.all([
      supabase.from("badges").select("*"),
      supabase.from("user_badges").select("badge_id").eq("user_id", userId),
      supabase.from("quiz_attempts").select("quiz_id, is_correct").eq("user_id", userId),
      supabase.from("dsa_submissions").select("question_id, score, status").eq("user_id", userId),
      supabase.from("xp_logs").select("amount").eq("user_id", userId),
      supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", userId).maybeSingle(),
      supabase.from("courses").select("id, title"),
      supabase.from("quizzes").select("id, course_id"),
      supabase.from("achievements").select("*"),
      supabase.from("user_achievements").select("achievement_id").eq("user_id", userId),
    ]);

    const earnedBadgeIds = new Set((userBadges || []).map((b: any) => b.badge_id));
    const earnedAchIds = new Set((userAchievements || []).map((a: any) => a.achievement_id));

    // Compute stats
    const totalXp = (xpLogs || []).reduce((s: number, x: any) => s + x.amount, 0);
    const correctQuizIds = new Set((quizAttempts || []).filter((q: any) => q.is_correct).map((q: any) => q.quiz_id));
    const totalCorrectQuizzes = correctQuizIds.size;
    const currentStreak = streak?.current_streak || 0;

    // DSA: count unique questions with accepted/high-score submissions
    const acceptedQuestions = new Set<string>();
    for (const s of (dsaSubs || [])) {
      if (s.status === "accepted" || s.score >= 70) {
        acceptedQuestions.add(s.question_id);
      }
    }
    const totalAcceptedDSA = acceptedQuestions.size;

    // Build course title -> course id mapping
    const courseByTitle: Record<string, string> = {};
    const courseById: Record<string, string> = {};
    for (const c of (courses || [])) {
      courseByTitle[c.title] = c.id;
      courseById[c.id] = c.title;
    }

    // Build course_id -> quiz_ids mapping
    const quizzesByCourse: Record<string, string[]> = {};
    for (const q of (quizzes || [])) {
      if (!quizzesByCourse[q.course_id]) quizzesByCourse[q.course_id] = [];
      quizzesByCourse[q.course_id].push(q.id);
    }

    // Helper: check if user completed enough quizzes for a specific course
    const getCorrectQuizzesForCourse = (courseTitle: string): number => {
      // Find course by title (fuzzy match)
      let courseId: string | null = null;
      for (const [title, id] of Object.entries(courseByTitle)) {
        if (title.toLowerCase().includes(courseTitle.toLowerCase()) ||
            courseTitle.toLowerCase().includes(title.toLowerCase())) {
          courseId = id;
          break;
        }
      }
      if (!courseId) return 0;
      const courseQuizIds = quizzesByCourse[courseId] || [];
      return courseQuizIds.filter(qid => correctQuizIds.has(qid)).length;
    };

    // Evaluate badge condition
    const evaluateRule = (rule: any): boolean => {
      if (!rule || !rule.type) return false;
      const minCount = rule.min_count || rule.count || 0;

      switch (rule.type) {
        case "quiz_count": {
          if (rule.course_title) {
            // Course-specific quiz badge
            const completed = getCorrectQuizzesForCourse(rule.course_title);
            return completed >= minCount;
          }
          // General quiz count
          return totalCorrectQuizzes >= minCount;
        }
        case "dsa_count":
          return totalAcceptedDSA >= minCount;
        case "xp_total":
          return totalXp >= (rule.min_xp || rule.amount || 0);
        case "streak":
          return currentStreak >= (rule.min_streak || rule.days || 0);
        default:
          return false;
      }
    };

    const newBadges: string[] = [];
    const newAchievements: string[] = [];

    // Award badges
    for (const badge of (allBadges || [])) {
      if (earnedBadgeIds.has(badge.id)) continue;
      const rule = badge.parsed_rule as any;
      if (evaluateRule(rule)) {
        const { error } = await supabase.from("user_badges").insert({ user_id: userId, badge_id: badge.id });
        if (!error) newBadges.push(badge.title);
      }
    }

    // Award achievements (same rule engine)
    for (const ach of (allAchievements || [])) {
      if (earnedAchIds.has(ach.id)) continue;
      const rule = ach.parsed_rule as any;
      if (evaluateRule(rule)) {
        const { error } = await supabase.from("user_achievements").insert({ user_id: userId, achievement_id: ach.id });
        if (!error) newAchievements.push(ach.title);
      }
    }

    return new Response(JSON.stringify({
      awarded_badges: newBadges,
      awarded_achievements: newAchievements,
      badge_count: newBadges.length,
      achievement_count: newAchievements.length,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("check-badges error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
