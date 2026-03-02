import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Medal } from "lucide-react";

interface Badge {
  id: string;
  title: string;
  description: string | null;
}

const BadgesPage: React.FC = () => {
  const { user } = useAuth();
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [earnedIds, setEarnedIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("badges").select("id, title, description"),
      supabase.from("user_badges").select("badge_id").eq("user_id", user.id),
    ]).then(([badges, earned]) => {
      setAllBadges(badges.data || []);
      setEarnedIds(new Set((earned.data || []).map((e: any) => e.badge_id)));
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Badges</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="shimmer h-32 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Badges</h1>
        <p className="text-muted-foreground mt-1">Earn badges by completing challenges</p>
      </div>

      {allBadges.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Medal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No badges available yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {allBadges.map(b => {
            const earned = earnedIds.has(b.id);
            return (
              <div key={b.id} className={`glass-card rounded-xl p-5 text-center transition-all duration-300 ${earned ? "border-primary/30 glow-border" : "opacity-60"}`}>
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-3 ${earned ? "bg-primary/20" : "bg-secondary"}`}>
                  <Medal className={`w-6 h-6 ${earned ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <h3 className="font-semibold text-foreground text-sm">{b.title}</h3>
                {b.description && <p className="text-xs text-muted-foreground mt-1">{b.description}</p>}
                <span className={`text-xs mt-2 inline-block px-2 py-0.5 rounded-full ${earned ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>
                  {earned ? "Earned ✓" : "Locked"}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BadgesPage;
