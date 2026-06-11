import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Save, Github, Code2, Trophy, Flame } from "lucide-react";
import ActivityHeatmap from "@/components/ActivityHeatmap";

const ProfilePage: React.FC = () => {
  const { user, userCode } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [github, setGithub] = useState("");
  const [branch, setBranch] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState(0);

  useEffect(() => {
    if (!user) return;
    // Load profile
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        setDisplayName(data.display_name || data.user_code || "");
        setBio(data.bio || "");
        setEmail((data as any).email || "");
        setGithub((data as any).github_username || "");
        setBranch((data as any).branch || "");
        setSkills(((data as any).skills || []).join(", "));
      }
    });
    // Load stats
    Promise.all([
      supabase.from("xp_logs").select("amount").eq("user_id", user.id),
      supabase.from("streaks").select("current_streak").eq("user_id", user.id).maybeSingle(),
      supabase.from("user_badges").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([xpRes, streakRes, badgeRes]) => {
      setXp(((xpRes as any).data || []).reduce((s: number, x: any) => s + x.amount, 0));
      setStreak((streakRes as any).data?.current_streak || 0);
      setBadges((badgeRes as any).count || 0);
    });
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from("profiles").update({
      display_name: displayName,
      bio,
      email,
      github_username: github,
      branch,
      skills: skills.split(",").map(s => s.trim()).filter(Boolean),
    } as any).eq("user_id", user.id);
    setSaving(false);
    if (error) toast.error(error.message);
    else toast.success("Profile saved!");
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground font-mono mb-1">$ cat profile.json</p>
        <h1 className="text-2xl font-bold text-foreground"><span className="text-primary">Profile</span></h1>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3">
        <div className="terminal-card rounded-lg p-4 text-center">
          <Trophy className="w-5 h-5 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold text-primary">{xp}</p>
          <p className="text-xs text-muted-foreground font-mono">XP</p>
        </div>
        <div className="terminal-card rounded-lg p-4 text-center">
          <Flame className="w-5 h-5 text-neon-amber mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{streak}d</p>
          <p className="text-xs text-muted-foreground font-mono">streak</p>
        </div>
        <div className="terminal-card rounded-lg p-4 text-center">
          <Code2 className="w-5 h-5 text-neon-cyan mx-auto mb-1" />
          <p className="text-lg font-bold text-foreground">{badges}</p>
          <p className="text-xs text-muted-foreground font-mono">badges</p>
        </div>
      </div>

      {/* Activity Heatmap */}
      <ActivityHeatmap />

      {/* Profile form */}
      <div className="terminal-card rounded-lg p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-14 h-14 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{userCode}</p>
            <p className="text-xs text-muted-foreground font-mono">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary font-mono">display_name:</label>
            <input value={displayName} onChange={e => setDisplayName(e.target.value)}
              className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary font-mono">branch:</label>
            <input value={branch} onChange={e => setBranch(e.target.value)} placeholder="e.g. CSE, ECE"
              className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-primary font-mono">email: <span className="text-destructive">*required for password reset</span></label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your.email@example.com"
            className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-primary font-mono">github_username:</label>
          <div className="relative">
            <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input value={github} onChange={e => setGithub(e.target.value)} placeholder="your-github-handle"
              className="w-full pl-10 pr-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm" />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-primary font-mono">skills[]:</label>
          <input value={skills} onChange={e => setSkills(e.target.value)} placeholder="Python, React, DSA, ML (comma separated)"
            className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm" />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-primary font-mono">bio:</label>
          <textarea value={bio} onChange={e => setBio(e.target.value)} rows={3}
            className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm resize-none" />
        </div>

        <button onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 glow-border">
          <Save className="w-4 h-4" />
          {saving ? "saving..." : "$ save --profile"}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
