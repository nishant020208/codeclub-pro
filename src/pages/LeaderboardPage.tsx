import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy, Crown, Medal, Star, Zap, TrendingUp } from "lucide-react";

const LEVELS = [
  { name: "Noob", min: 0, max: 100, color: "hsl(var(--muted-foreground))" },
  { name: "Hacker", min: 100, max: 500, color: "hsl(var(--neon-cyan))" },
  { name: "Pro", min: 500, max: 1500, color: "hsl(var(--neon-green))" },
  { name: "Elite", min: 1500, max: 5000, color: "hsl(var(--neon-amber))" },
  { name: "Legend", min: 5000, max: 99999, color: "hsl(var(--neon-red))" },
];

function getLevel(xp: number) {
  return LEVELS.find(l => xp >= l.min && xp < l.max) || LEVELS[LEVELS.length - 1];
}

function getLevelProgress(xp: number) {
  const level = getLevel(xp);
  return Math.min(100, ((xp - level.min) / (level.max - level.min)) * 100);
}

interface LeaderEntry { user_id: string; user_code: string; total_xp: number; }

const LeaderboardPage: React.FC = () => {
  const { user } = useAuth();
  const [leaders, setLeaders] = useState<LeaderEntry[]>([]);
  const [myXp, setMyXp] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data: xpData } = await supabase.from("xp_logs").select("user_id, amount");
      const { data: profiles } = await supabase.from("profiles").select("user_id, user_code");
      const xpMap = new Map<string, number>();
      (xpData || []).forEach((x: any) => xpMap.set(x.user_id, (xpMap.get(x.user_id) || 0) + x.amount));
      const profileMap = new Map<string, string>();
      (profiles || []).forEach((p: any) => profileMap.set(p.user_id, p.user_code));
      const entries = Array.from(xpMap.entries()).map(([uid, xp]) => ({ user_id: uid, user_code: profileMap.get(uid) || "???", total_xp: xp })).sort((a, b) => b.total_xp - a.total_xp);
      setLeaders(entries);
      if (user) setMyXp(xpMap.get(user.id) || 0);
      setLoading(false);
    };
    fetch();
  }, [user]);

  const myLevel = getLevel(myXp);
  const myProgress = getLevelProgress(myXp);
  const myRank = leaders.findIndex(l => l.user_id === user?.id) + 1;
  const rankIcons = [Crown, Trophy, Medal];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground font-mono mb-1">$ leaderboard --sort xp</p>
        <h1 className="text-2xl font-bold"><span className="text-primary">Leaderboard</span></h1>
      </div>

      {user && !loading && (
        <div className="terminal-card rounded-lg p-5">
          <div className="flex items-center gap-4 mb-3">
            <div className="w-12 h-12 rounded-md flex items-center justify-center bg-primary/10 border border-primary/20">
              <Star className="w-6 h-6 text-primary" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-foreground" style={{ color: myLevel.color }}>{myLevel.name}</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary font-mono">#{myRank || "—"}</span>
              </div>
              <p className="text-xs text-muted-foreground font-mono">{myXp} XP</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-primary animate-count-up">{myXp}</p>
            </div>
          </div>
          <div className="h-2 rounded-full bg-secondary overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000" style={{ width: `${myProgress}%`, background: myLevel.color }} />
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="shimmer h-14 rounded-lg" />)}</div>
      ) : leaders.length === 0 ? (
        <div className="terminal-card rounded-lg p-12 text-center">
          <Zap className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">No XP data yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {leaders.slice(0, 50).map((entry, i) => {
            const level = getLevel(entry.total_xp);
            const progress = getLevelProgress(entry.total_xp);
            const RankIcon = rankIcons[i] || TrendingUp;
            const isMe = entry.user_id === user?.id;
            return (
              <div key={entry.user_id} className={`terminal-card rounded-md p-3 flex items-center gap-3 ${isMe ? "ring-1 ring-primary/30" : ""}`}>
                <div className="w-8 h-8 rounded-md flex items-center justify-center shrink-0" style={i < 3 ? { background: `${level.color}15`, border: `1px solid ${level.color}30` } : {}}>
                  {i < 3 ? <RankIcon className="w-4 h-4" style={{ color: level.color }} /> : <span className="text-xs font-bold text-muted-foreground">#{i + 1}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground text-sm truncate">{entry.user_code}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md font-mono" style={{ background: `${level.color}15`, color: level.color }}>{level.name}</span>
                  </div>
                  <div className="h-1 rounded-full bg-secondary mt-1 w-24">
                    <div className="h-full rounded-full" style={{ width: `${progress}%`, background: level.color }} />
                  </div>
                </div>
                <span className="text-sm font-bold text-primary shrink-0">{entry.total_xp} XP</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LeaderboardPage;
