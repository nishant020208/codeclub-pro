import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Zap, Clock, ArrowRight } from "lucide-react";

const DailyChallenge: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState<any>(null);
  const [solved, setSolved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const today = new Date().toISOString().split("T")[0];

    supabase
      .from("daily_challenges" as any)
      .select("*, dsa_questions(*)")
      .eq("challenge_date", today)
      .maybeSingle()
      .then(async ({ data }: any) => {
        if (data) {
          setChallenge(data);
          // Check if user already solved it
          const { count } = await supabase
            .from("dsa_submissions")
            .select("id", { count: "exact", head: true })
            .eq("user_id", user.id)
            .eq("question_id", data.question_id)
            .gte("score", 70);
          setSolved((count || 0) > 0);
        }
        setLoading(false);
      });
  }, [user]);

  if (loading || !challenge) return null;

  const question = challenge.dsa_questions;
  const diffColor = question?.difficulty === "Easy" ? "text-primary" : question?.difficulty === "Medium" ? "text-neon-amber" : "text-destructive";

  return (
    <div className="terminal-card rounded-lg p-5 border-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full" />
      <div className="flex items-center gap-2 mb-3">
        <Zap className="w-4 h-4 text-primary" />
        <span className="text-xs font-mono font-bold text-primary">DAILY CHALLENGE</span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-mono">
          +{challenge.bonus_xp} XP
        </span>
      </div>

      <h3 className="font-bold text-foreground text-sm">{question?.title}</h3>
      <div className="flex items-center gap-3 mt-2">
        <span className={`text-xs font-mono font-medium ${diffColor}`}>{question?.difficulty}</span>
        <span className="text-xs text-muted-foreground font-mono">{question?.language}</span>
      </div>

      {solved ? (
        <div className="mt-3 px-3 py-2 rounded-md bg-primary/10 border border-primary/20 text-xs text-primary font-mono">
          ✓ Solved today! Great job!
        </div>
      ) : (
        <button
          onClick={() => navigate("/dashboard/dsa")}
          className="mt-3 flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all glow-border"
        >
          Solve Now <ArrowRight className="w-3 h-3" />
        </button>
      )}
    </div>
  );
};

export default DailyChallenge;
