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

    // Get user from token
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: userError } = await anonClient.auth.getUser(authHeader.replace("Bearer ", ""));
    if (userError || !user) throw new Error("Unauthorized");

    const userId = user.id;

    // Get all badges and user's existing badges
    const [{ data: allBadges }, { data: userBadges }, { data: quizAttempts }, { data: dsaSubs }, { data: xpLogs }, { data: streak }] = await Promise.all([
      supabase.from("badges").select("*"),
      supabase.from("user_badges").select("badge_id").eq("user_id", userId),
      supabase.from("quiz_attempts").select("quiz_id, is_correct").eq("user_id", userId),
      supabase.from("dsa_submissions").select("question_id, score, status").eq("user_id", userId),
      supabase.from("xp_logs").select("amount").eq("user_id", userId),
      supabase.from("streaks").select("current_streak, longest_streak").eq("user_id", userId).maybeSingle(),
    ]);

    const earnedIds = new Set((userBadges || []).map((b: any) => b.badge_id));
    const totalXp = (xpLogs || []).reduce((s: number, x: any) => s + x.amount, 0);
    const correctQuizzes = (quizAttempts || []).filter((q: any) => q.is_correct).length;
    const totalQuizzes = (quizAttempts || []).length;
    const acceptedDSA = (dsaSubs || []).filter((s: any) => s.status === "accepted" || s.score >= 70).length;
    const totalDSA = new Set((dsaSubs || []).map((s: any) => s.question_id)).size;
    const currentStreak = streak?.current_streak || 0;

    const newBadges: string[] = [];

    for (const badge of (allBadges || [])) {
      if (earnedIds.has(badge.id)) continue;

      const rule = badge.parsed_rule as any;
      if (!rule || !rule.type) continue;

      let earned = false;

      switch (rule.type) {
        case "quiz_count":
          earned = correctQuizzes >= (rule.count || 1);
          break;
        case "dsa_count":
          earned = acceptedDSA >= (rule.count || 1);
          break;
        case "dsa_solved":
          earned = totalDSA >= (rule.count || 1);
          break;
        case "xp_total":
          earned = totalXp >= (rule.amount || 100);
          break;
        case "streak":
          earned = currentStreak >= (rule.days || 7);
          break;
        case "quiz_score":
          // Check if user completed all quizzes for a specific topic/course with passing score
          earned = correctQuizzes >= (rule.count || 5);
          break;
        case "first_submission":
          earned = totalDSA >= 1;
          break;
        case "perfect_score":
          earned = (dsaSubs || []).some((s: any) => s.score === 100);
          break;
        default:
          // Try keyword matching in rule_text
          const ruleText = (badge.rule_text || "").toLowerCase();
          if (ruleText.includes("quiz") && correctQuizzes > 0) earned = true;
          if (ruleText.includes("dsa") && acceptedDSA > 0) earned = true;
          if (ruleText.includes("streak") && currentStreak >= 3) earned = true;
          if (ruleText.includes("xp") && totalXp >= 50) earned = true;
          break;
      }

      if (earned) {
        const { error } = await supabase.from("user_badges").insert({ user_id: userId, badge_id: badge.id });
        if (!error) newBadges.push(badge.title);
      }
    }

    return new Response(JSON.stringify({ awarded: newBadges, count: newBadges.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("check-badges error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
