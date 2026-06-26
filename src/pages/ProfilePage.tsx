import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Save, Github, Code2, Trophy, Flame, Pencil, X } from "lucide-react";
import ActivityHeatmap from "@/components/ActivityHeatmap";

interface ProfileForm {
  fullName: string;
  displayName: string;
  bio: string;
  email: string;
  mobile: string;
  github: string;
  branch: string;
  skills: string;
}

const empty: ProfileForm = { fullName: "", displayName: "", bio: "", email: "", mobile: "", github: "", branch: "", skills: "" };

const ProfilePage: React.FC = () => {
  const { user, userCode } = useAuth();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<ProfileForm>(empty);
  const [original, setOriginal] = useState<ProfileForm>(empty);
  const [xp, setXp] = useState(0);
  const [streak, setStreak] = useState(0);
  const [badges, setBadges] = useState(0);

  const loadProfile = () => {
    if (!user) return;
    supabase.from("profiles").select("*").eq("user_id", user.id).single().then(({ data }) => {
      if (data) {
        const next: ProfileForm = {
          fullName: (data as any).full_name || "",
          displayName: (data as any).display_name || (data as any).username || "",
          bio: (data as any).bio || "",
          email: (data as any).email || user.email || "",
          mobile: (data as any).mobile || (user.user_metadata as any)?.mobile || "",
          github: (data as any).github_username || "",
          branch: (data as any).branch || "",
          skills: (((data as any).skills) || []).join(", "),
        };
        setForm(next);
        setOriginal(next);
      }
    });
  };

  useEffect(() => {
    loadProfile();
    if (!user) return;
    Promise.all([
      supabase.from("xp_logs").select("amount").eq("user_id", user.id),
      supabase.from("streaks").select("current_streak").eq("user_id", user.id).maybeSingle(),
      supabase.from("user_badges").select("id", { count: "exact", head: true }).eq("user_id", user.id),
    ]).then(([xpRes, streakRes, badgeRes]) => {
      setXp(((xpRes as any).data || []).reduce((s: number, x: any) => s + x.amount, 0));
      setStreak((streakRes as any).data?.current_streak || 0);
      setBadges((badgeRes as any).count || 0);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const update: any = {
      full_name: form.fullName.trim(),
      display_name: form.displayName.trim() || form.fullName.trim(),
      bio: form.bio.trim(),
      email: form.email.trim(),
      mobile: form.mobile.trim(),
      github_username: form.github.trim().replace(/^@/, ""),
      branch: form.branch.trim(),
      skills: form.skills.split(",").map(s => s.trim()).filter(Boolean),
    };
    const { error } = await supabase.from("profiles").update(update).eq("user_id", user.id);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    setOriginal(form);
    setEditing(false);
    toast.success("Profile updated!");
  };

  const handleCancel = () => {
    setForm(original);
    setEditing(false);
  };

  const FieldRO = ({ label, value, mono = true }: { label: string; value: string; mono?: boolean }) => (
    <div className="space-y-1">
      <p className="text-xs font-bold text-primary font-mono">{label}</p>
      <p className={`text-sm text-foreground break-words ${mono ? "font-mono" : ""}`}>{value || <span className="text-muted-foreground italic">— not set —</span>}</p>
    </div>
  );

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground font-mono mb-1">$ cat profile.json</p>
          <h1 className="text-2xl font-bold text-foreground"><span className="text-primary">Profile</span></h1>
        </div>
        {!editing ? (
          <button onClick={() => setEditing(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-primary/10 border border-primary/30 text-primary font-mono text-xs font-bold hover:bg-primary/20 transition-colors min-h-[40px]">
            <Pencil className="w-3.5 h-3.5" /> Edit Profile
          </button>
        ) : (
          <button onClick={handleCancel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-md bg-muted border border-border text-muted-foreground font-mono text-xs hover:bg-muted/80 min-h-[40px]">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        )}
      </div>

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

      <ActivityHeatmap />

      <div className="terminal-card rounded-lg p-5 sm:p-6 space-y-5">
        <div className="flex items-center gap-4 pb-4 border-b border-border">
          <div className="w-14 h-14 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
            <User className="w-7 h-7 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-foreground truncate">{form.fullName || userCode}</p>
            <p className="text-xs text-muted-foreground font-mono truncate">{user?.email}</p>
          </div>
        </div>

        {!editing ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <FieldRO label="full_name:" value={form.fullName} />
            <FieldRO label="display_name:" value={form.displayName} />
            <FieldRO label="email:" value={form.email} />
            <FieldRO label="mobile_number:" value={form.mobile} />
            <FieldRO label="github:" value={form.github ? `@${form.github}` : ""} />
            <FieldRO label="branch:" value={form.branch} />
            <FieldRO label="skills:" value={form.skills} />
            <div className="sm:col-span-2"><FieldRO label="bio:" value={form.bio} mono={false} /></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary font-mono">full_name:</label>
                <input value={form.fullName} onChange={e => setForm({ ...form, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[44px]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary font-mono">display_name:</label>
                <input value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })}
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[44px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary font-mono">email:</label>
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[44px]" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary font-mono">mobile_number:</label>
                <input type="tel" inputMode="tel" autoComplete="tel" value={form.mobile} onChange={e => setForm({ ...form, mobile: e.target.value })} placeholder="Enter your mobile number"
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[44px]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-primary font-mono">branch:</label>
                <input value={form.branch} onChange={e => setForm({ ...form, branch: e.target.value })} placeholder="e.g. CSE, ECE"
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[44px]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary font-mono">github_username:</label>
              <div className="relative">
                <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={form.github} onChange={e => setForm({ ...form, github: e.target.value })} placeholder="your-github-handle"
                  className="w-full pl-10 pr-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[44px]" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary font-mono">skills[]:</label>
              <input value={form.skills} onChange={e => setForm({ ...form, skills: e.target.value })} placeholder="Python, React, DSA (comma separated)"
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[44px]" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-primary font-mono">bio:</label>
              <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={4}
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm resize-none" />
            </div>

            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 glow-border min-h-[44px]">
                {saving ? <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
                {saving ? "saving..." : "$ save --profile"}
              </button>
              <button onClick={handleCancel} disabled={saving}
                className="px-5 py-3 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors min-h-[44px] font-mono text-sm">
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
