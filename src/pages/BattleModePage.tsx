import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Swords, Clock, Loader2, Terminal, Trophy, Zap } from "lucide-react";
import { toast } from "sonner";

interface Battle {
  id: string;
  challenger_id: string;
  opponent_id: string | null;
  question_id: string | null;
  status: string;
  winner_id: string | null;
  challenger_score: number | null;
  opponent_score: number | null;
  started_at: string | null;
  ended_at: string | null;
}

const BattleModePage: React.FC = () => {
  const { user } = useAuth();
  const [battles, setBattles] = useState<Battle[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [profiles, setProfiles] = useState<Map<string, string>>(new Map());

  const fetchBattles = async () => {
    const { data } = await supabase.from("battles").select("*").order("created_at", { ascending: false }).limit(50);
    setBattles((data as any) || []);
    // fetch profiles for display
    const userIds = new Set<string>();
    (data || []).forEach((b: any) => { userIds.add(b.challenger_id); if (b.opponent_id) userIds.add(b.opponent_id); });
    if (userIds.size > 0) {
      const { data: profs } = await supabase.from("profiles").select("user_id, user_code").in("user_id", Array.from(userIds));
      const map = new Map<string, string>();
      (profs || []).forEach((p: any) => map.set(p.user_id, p.user_code));
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBattles();
    // Realtime subscription
    const channel = supabase.channel('battles-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'battles' }, () => fetchBattles())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const createBattle = async () => {
    if (!user) return;
    setCreating(true);
    // Pick a random question
    const { data: questions } = await supabase.from("dsa_questions").select("id").limit(100);
    if (!questions || questions.length === 0) {
      toast.error("No DSA questions available for battle");
      setCreating(false);
      return;
    }
    const randomQ = questions[Math.floor(Math.random() * questions.length)];
    const { error } = await supabase.from("battles").insert({
      challenger_id: user.id,
      question_id: randomQ.id,
      status: "waiting",
    });
    if (error) toast.error(error.message);
    else toast.success("Battle created! Waiting for opponent...");
    setCreating(false);
  };

  const joinBattle = async (battleId: string) => {
    if (!user) return;
    const { error } = await supabase.from("battles").update({
      opponent_id: user.id,
      status: "active",
      started_at: new Date().toISOString(),
    }).eq("id", battleId);
    if (error) toast.error(error.message);
    else toast.success("Battle joined! Fight!");
  };

  const statusColor = (s: string) => {
    if (s === "waiting") return "text-neon-amber";
    if (s === "active") return "text-neon-green";
    if (s === "completed") return "text-muted-foreground";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-mono mb-1">$ battle --mode 1v1</p>
          <h1 className="text-2xl font-bold text-foreground">
            <span className="text-primary">Peer</span> Battle Mode
          </h1>
        </div>
        <button onClick={createBattle} disabled={creating}
          className="px-5 py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-all glow-border disabled:opacity-50">
          {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Swords className="w-4 h-4" />}
          Create Battle
        </button>
      </div>

      {/* How it works */}
      <div className="terminal-card rounded-lg p-5">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-3 h-3 rounded-full bg-neon-green/60" />
          <span className="text-xs text-muted-foreground font-mono">how_it_works.md</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <Swords className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">1. Create or Join</p>
              <p className="text-muted-foreground">Create a battle or join an open one</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Terminal className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">2. Same Problem</p>
              <p className="text-muted-foreground">Both solve the same random DSA question</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Trophy className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-foreground">3. Fastest Wins</p>
              <p className="text-muted-foreground">Best score in least time takes the crown</p>
            </div>
          </div>
        </div>
      </div>

      {/* Battle list */}
      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="shimmer h-16 rounded-lg" />)}</div>
      ) : battles.length === 0 ? (
        <div className="terminal-card rounded-lg p-12 text-center">
          <Swords className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">No battles yet. Be the first to create one!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {battles.map((b) => {
            const isChallenger = b.challenger_id === user?.id;
            const isOpponent = b.opponent_id === user?.id;
            const canJoin = b.status === "waiting" && !isChallenger && !b.opponent_id;
            return (
              <div key={b.id} className={`terminal-card rounded-lg p-4 flex items-center gap-4 ${isChallenger || isOpponent ? "ring-1 ring-primary/20" : ""}`}>
                <Swords className="w-5 h-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-foreground text-sm">{profiles.get(b.challenger_id) || "???"}</span>
                    <span className="text-muted-foreground text-xs">vs</span>
                    <span className="font-bold text-foreground text-sm">{b.opponent_id ? profiles.get(b.opponent_id) || "???" : "???"}</span>
                    <span className={`text-xs font-bold uppercase ${statusColor(b.status)}`}>[{b.status}]</span>
                  </div>
                </div>
                {canJoin && (
                  <button onClick={() => joinBattle(b.id)}
                    className="px-4 py-2 rounded-md bg-primary/10 text-primary font-bold text-xs hover:bg-primary/20 transition-all border border-primary/20">
                    JOIN
                  </button>
                )}
                {b.winner_id && (
                  <div className="flex items-center gap-1 text-neon-amber text-xs font-bold">
                    <Trophy className="w-3 h-3" />
                    {profiles.get(b.winner_id) || "???"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default BattleModePage;
