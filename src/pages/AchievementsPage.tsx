import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
}

const AchievementsPage: React.FC = () => {
  const { user } = useAuth();
  const [all, setAll] = useState<Achievement[]>([]);
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("achievements").select("id, title, description"),
      supabase.from("user_achievements").select("achievement_id").eq("user_id", user.id),
    ]).then(([items, earned]) => {
      setAll(items.data || []);
      setEarnedIds(new Set((earned.data || []).map((e: any) => e.achievement_id)));
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="shimmer h-24 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
        <p className="text-muted-foreground mt-1">Track your coding milestones</p>
      </div>

      {all.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No achievements available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {all.map(a => {
            const earned = earnedIds.has(a.id);
            return (
              <div key={a.id} className={`glass-card rounded-xl p-5 flex items-center gap-4 transition-all duration-300 ${earned ? "border-primary/30" : "opacity-60"}`}>
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${earned ? "bg-primary/20" : "bg-secondary"}`}>
                  <Trophy className={`w-5 h-5 ${earned ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-sm">{a.title}</h3>
                  {a.description && <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>}
                </div>
                <span className={`text-xs px-2 py-0.5 rounded-full ${earned ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {earned ? "Unlocked ✓" : "Locked"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage;
