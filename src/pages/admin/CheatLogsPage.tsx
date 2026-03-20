import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Shield, AlertTriangle, User, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CheatLog {
  id: string;
  user_id: string;
  event_type: string;
  details: any;
  page: string | null;
  created_at: string;
}

const CheatLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<CheatLog[]>([]);
  const [profiles, setProfiles] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchLogs = async () => {
      const { data } = await supabase.from("cheat_logs").select("*").order("created_at", { ascending: false }).limit(200);
      setLogs((data as any) || []);
      const userIds = new Set<string>();
      (data || []).forEach((l: any) => userIds.add(l.user_id));
      if (userIds.size > 0) {
        const { data: profs } = await supabase.from("profiles").select("user_id, user_code").in("user_id", Array.from(userIds));
        const map = new Map<string, string>();
        (profs || []).forEach((p: any) => map.set(p.user_id, p.user_code));
        setProfiles(map);
      }
      setLoading(false);
    };
    fetchLogs();
  }, []);

  const eventColor = (type: string) => {
    if (type === "tab_switch") return "text-neon-amber";
    if (type === "paste") return "text-neon-red";
    if (type === "copy") return "text-neon-red";
    return "text-muted-foreground";
  };

  const filtered = filter === "all" ? logs : logs.filter(l => l.event_type === filter);

  // Aggregate suspicious users
  const userCounts = new Map<string, number>();
  logs.forEach(l => userCounts.set(l.user_id, (userCounts.get(l.user_id) || 0) + 1));
  const suspiciousUsers = Array.from(userCounts.entries()).sort((a, b) => b[1] - a[1]).slice(0, 10);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground font-mono mb-1">$ sudo cheat-detect --monitor</p>
        <h1 className="text-2xl font-bold text-foreground">
          <span className="text-primary">Anti-Cheat</span> Monitor
        </h1>
      </div>

      {/* Suspicious users summary */}
      <div className="terminal-card rounded-lg p-5">
        <h3 className="text-sm font-bold text-primary font-mono mb-3">// Most flagged users</h3>
        <div className="flex gap-2 flex-wrap">
          {suspiciousUsers.map(([uid, count]) => (
            <div key={uid} className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="w-3 h-3 text-destructive" />
              <span className="text-xs font-bold text-foreground">{profiles.get(uid) || "???"}</span>
              <span className="text-xs text-destructive font-mono">{count} events</span>
            </div>
          ))}
          {suspiciousUsers.length === 0 && <p className="text-xs text-muted-foreground">No suspicious activity detected.</p>}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["all", "tab_switch", "copy", "paste", "right_click"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}>
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-2">{[1,2,3,4,5].map(i => <div key={i} className="shimmer h-12 rounded-lg" />)}</div>
      ) : (
        <div className="space-y-1">
          {filtered.slice(0, 100).map(l => (
            <div key={l.id} className="terminal-card rounded-md px-4 py-3 flex items-center gap-3 text-xs">
              <Shield className="w-3.5 h-3.5 text-destructive shrink-0" />
              <span className="font-bold text-foreground w-24 truncate">{profiles.get(l.user_id) || "???"}</span>
              <span className={`font-bold uppercase w-20 ${eventColor(l.event_type)}`}>{l.event_type}</span>
              <span className="text-muted-foreground flex-1 truncate">{l.page || "—"}</span>
              <span className="text-muted-foreground font-mono">{formatDistanceToNow(new Date(l.created_at), { addSuffix: true })}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CheatLogsPage;
