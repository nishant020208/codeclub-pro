import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Crown, Medal, Star, Zap, TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const LEVELS = [
  { name: "Beginner", min: 0, max: 100, color: "hsl(var(--muted-foreground))" },
  { name: "Intermediate", min: 100, max: 500, color: "hsl(var(--neon-cyan))" },
  { name: "Pro", min: 500, max: 1500, color: "hsl(var(--neon-purple))" },
  { name: "Elite", min: 1500, max: 5000, color: "hsl(var(--neon-pink))" },
  { name: "Legend", min: 5000, max: 99999, color: "hsl(var(--neon-orange))" },
];

function getLevel(xp: number) {
  return LEVELS.find((l) => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
}

function getLevelProgress(xp: number) {
  const level = getLevel(xp);
  const range = level.max - level.min;
  return Math.min(100, ((xp - level.min) / range) * 100);
}

interface LeaderEntry {
  user_id: string;
  user_code: string;
  total_xp: number;
}

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [myXp, setMyXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Get all XP logs grouped by user
      const { data: xpData } = await supabase.from("xp_logs").select("user_id, amount");
      const { data: profiles } = await supabase.from("profiles").select("user_id, user_code");

      const xpMap = new Map<string, number>();
      (xpData || []).forEach((x: any) => {
        xpMap.set(x.user_id, (xpMap.get(x.user_id) || 0) + x.amount);
      });

      const profileMap = new Map<string, string>();
      (profiles || []).forEach((p: any) => profileMap.set(p.user_id, p.user_code));

      const entries: LeaderEntry[] = Array.from(xpMap.entries())
        .map(([user_id, total_xp]) => ({
          user_id,
          user_code: profileMap.get(user_id) || "Unknown",
          total_xp,
        }))
        .sort((a, b) => b.total_xp - a.total_xp);

      setLeaders(entries);
      if (user) setMyXp(xpMap.get(user.id) || 0);
      setLoading(false);
    };
    fetchLeaderboard();
  }, [user]);

  const myLevel = getLevel(myXp);
  const myProgress = getLevelProgress(myXp);
  const myRank = leaders.findIndex((l) => l.user_id === user?.id) + 1;

  const rankIcons = [Crown, Trophy, Medal];
  const rankColors = ["hsl(var(--neon-orange))", "hsl(var(--neon-purple))", "hsl(var(--neon-cyan))"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="gradient-text-neon">Leaderboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">Compete, earn XP, and climb the ranks</p>
      </div>

      {/* My Stats Card */}
      {user && !loading && (
        <div className="neon-card rounded-2xl p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `${myLevel.color}20`, border: `1px solid ${myLevel.color}40` }}>
              <Star className="w-7 h-7" style={{ color: myLevel.color }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-foreground">{myLevel.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">Rank #{myRank || "—"}</span>
              </div>
              <p className="text-sm text-muted-foreground">{myXp} XP total</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold gradient-text-neon animate-count-up">{myXp}</p>
              <p className="text-xs text-muted-foreground">XP Points</p>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{myLevel.name}</span>
              <span>{Math.round(myProgress)}%</span>
            </div>
            <div className="h-3 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-1000 ease-out animate-gradient"
                style={{
                  width: `${myProgress}%`,
                  background: "var(--gradient-neon)",
                  backgroundSize: "200% 200%",
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      {loading ? (
        <div className="space-y-3">{[1, 2, 3, 4, 5].map((i) => <div key={i} className="shimmer h-16 rounded-xl" />)}</div>
      ) : leaders.length === 0 ? (
        <div className="neon-card rounded-2xl p-12 text-center">
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No XP data yet. Start earning!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {leaders.slice(0, 50).map((entry, i) => {
            const level = getLevel(entry.total_xp);
            const progress = getLevelProgress(entry.total_xp);
            const RankIcon = rankIcons[i] || TrendingUp;
            const isMe = entry.user_id === user?.id;

            return (
              <div
                key={entry.user_id}
                className={`neon-card rounded-xl p-4 flex items-center gap-4 ${isMe ? "ring-1 ring-primary/30" : ""}`}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0" style={i < 3 ? { background: `${rankColors[i]}15`, border: `1px solid ${rankColors[i]}30` } : {}}>
                  {i < 3 ? (
                    <RankIcon className="w-5 h-5" style={{ color: rankColors[i] }} />
                  ) : (
                    <span className="text-sm font-bold text-muted-foreground">#{i + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground truncate">{entry.user_code}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded-md" style={{ background: `${level.color}15`, color: level.color }}>{level.name}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-secondary mt-1.5 w-32">
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: level.color }} />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-lg font-bold text-foreground">{entry.total_xp}</span>
                  <span className="text-xs text-muted-foreground ml-1">XP</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
