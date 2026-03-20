import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Users, Plus, Loader2, Crown, UserPlus, LogOut } from "lucide-react";

interface Team {
  id: string;
  name: string;
  description: string | null;
  created_by: string;
  created_at: string;
}

interface TeamMember {
  id: string;
  team_id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

const TeamsPage: React.FC = () => {
  const { user } = useAuth();
  const [teams, setTeams] = useState<Team[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [profiles, setProfiles] = useState<Map<string, string>>(new Map());
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchTeams = async () => {
    const { data: teamData } = await supabase.from("teams").select("*").order("created_at", { ascending: false });
    setTeams((teamData as any) || []);
    const { data: memberData } = await supabase.from("team_members").select("*");
    setMembers((memberData as any) || []);
    // fetch profiles
    const userIds = new Set<string>();
    (teamData || []).forEach((t: any) => userIds.add(t.created_by));
    (memberData || []).forEach((m: any) => userIds.add(m.user_id));
    if (userIds.size > 0) {
      const { data: profs } = await supabase.from("profiles").select("user_id, user_code").in("user_id", Array.from(userIds));
      const map = new Map<string, string>();
      (profs || []).forEach((p: any) => map.set(p.user_id, p.user_code));
      setProfiles(map);
    }
    setLoading(false);
  };

  useEffect(() => { fetchTeams(); }, []);

  const createTeam = async () => {
    if (!user || !newName.trim()) return;
    setSubmitting(true);
    const { data: team, error } = await supabase.from("teams").insert({ name: newName, description: newDesc || null, created_by: user.id }).select().single();
    if (error) { toast.error(error.message); setSubmitting(false); return; }
    // Auto-join as leader
    await supabase.from("team_members").insert({ team_id: (team as any).id, user_id: user.id, role: "leader" });
    toast.success("Team created!");
    setShowNew(false); setNewName(""); setNewDesc("");
    fetchTeams();
    setSubmitting(false);
  };

  const joinTeam = async (teamId: string) => {
    if (!user) return;
    const { error } = await supabase.from("team_members").insert({ team_id: teamId, user_id: user.id });
    if (error) toast.error(error.message);
    else { toast.success("Joined team!"); fetchTeams(); }
  };

  const leaveTeam = async (teamId: string) => {
    if (!user) return;
    const { error } = await supabase.from("team_members").delete().eq("team_id", teamId).eq("user_id", user.id);
    if (error) toast.error(error.message);
    else { toast.success("Left team."); fetchTeams(); }
  };

  const getTeamMembers = (teamId: string) => members.filter(m => m.team_id === teamId);
  const isInTeam = (teamId: string) => members.some(m => m.team_id === teamId && m.user_id === user?.id);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground font-mono mb-1">$ team --list</p>
          <h1 className="text-2xl font-bold text-foreground"><span className="text-primary">Teams</span></h1>
        </div>
        <button onClick={() => setShowNew(true)}
          className="px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-bold text-sm flex items-center gap-2 hover:bg-primary/90 glow-border">
          <Plus className="w-4 h-4" /> Create Team
        </button>
      </div>

      {showNew && (
        <div className="terminal-card rounded-lg p-5 animate-fade-in space-y-4">
          <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Team name"
            className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary font-mono" />
          <textarea value={newDesc} onChange={e => setNewDesc(e.target.value)} placeholder="Description (optional)"
            rows={2} className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:ring-1 focus:ring-primary font-mono resize-none" />
          <div className="flex gap-2">
            <button onClick={createTeam} disabled={submitting} className="px-5 py-2 rounded-md bg-primary text-primary-foreground font-bold text-sm disabled:opacity-50">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
            </button>
            <button onClick={() => setShowNew(false)} className="px-4 py-2 text-sm text-muted-foreground">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="shimmer h-24 rounded-lg" />)}</div>
      ) : teams.length === 0 ? (
        <div className="terminal-card rounded-lg p-12 text-center">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono">No teams yet. Create the first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {teams.map(t => {
            const teamMembers = getTeamMembers(t.id);
            const joined = isInTeam(t.id);
            return (
              <div key={t.id} className="terminal-card rounded-lg p-5">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-bold text-foreground">{t.name}</h3>
                    {t.description && <p className="text-xs text-muted-foreground mt-1">{t.description}</p>}
                  </div>
                  <Users className="w-5 h-5 text-primary shrink-0" />
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  {teamMembers.map(m => (
                    <span key={m.id} className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">
                      {m.role === "leader" && <Crown className="w-3 h-3 text-neon-amber" />}
                      {profiles.get(m.user_id) || "???"}
                    </span>
                  ))}
                </div>
                {joined ? (
                  <button onClick={() => leaveTeam(t.id)} className="text-xs px-3 py-1.5 rounded-md text-destructive bg-destructive/10 hover:bg-destructive/20 flex items-center gap-1">
                    <LogOut className="w-3 h-3" /> Leave
                  </button>
                ) : (
                  <button onClick={() => joinTeam(t.id)} className="text-xs px-3 py-1.5 rounded-md text-primary bg-primary/10 hover:bg-primary/20 flex items-center gap-1">
                    <UserPlus className="w-3 h-3" /> Join
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TeamsPage;
