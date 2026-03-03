import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Swords, Calendar, Clock, Trophy, Send, ExternalLink, Github } from "lucide-react";
import { toast } from "sonner";

interface Competition {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  start_time: string | null;
  rules: string | null;
  xp_reward: number | null;
  status: string | null;
}

function getCountdown(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return "Ended";
  const d = Math.floor(diff / 86400000);
  const h = Math.floor((diff % 86400000) / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (d > 0) return `${d}d ${h}h remaining`;
  if (h > 0) return `${h}h ${m}m remaining`;
  return `${m}m remaining`;
}

const CompetitionsPage: React.FC = () => {
  const { user } = useAuth();
  const [comps, setComps] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitForm, setSubmitForm] = useState({ github_link: "", submission_url: "", notes: "" });
  const [mySubmissions, setMySubmissions] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from("competitions").select("*").order("created_at", { ascending: false });
      setComps((data as Competition[]) || []);
      if (user) {
        const { data: subs } = await supabase.from("contest_submissions").select("competition_id").eq("user_id", user.id);
        setMySubmissions(new Set((subs || []).map((s: any) => s.competition_id)));
      }
      setLoading(false);
    };
    fetch();
  }, [user]);

  const handleSubmit = async (compId: string) => {
    if (!user) return;
    const { error } = await supabase.from("contest_submissions").insert({
      competition_id: compId,
      user_id: user.id,
      github_link: submitForm.github_link || null,
      submission_url: submitForm.submission_url || null,
      notes: submitForm.notes || null,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Submission sent! 🎉");
    setMySubmissions(new Set([...mySubmissions, compId]));
    setSubmitting(null);
    setSubmitForm({ github_link: "", submission_url: "", notes: "" });
  };

  const statusColors: Record<string, string> = {
    upcoming: "hsl(var(--neon-blue))",
    active: "hsl(var(--neon-green))",
    ended: "hsl(var(--muted-foreground))",
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold">
          <span className="gradient-text-neon">Contests</span> & Hackathons
        </h1>
        <p className="text-muted-foreground mt-1">Compete, build, and win XP rewards</p>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2].map((i) => <div key={i} className="shimmer h-40 rounded-xl" />)}</div>
      ) : comps.length === 0 ? (
        <div className="neon-card rounded-2xl p-12 text-center">
          <Swords className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No contests yet. Stay tuned!</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {comps.map((c) => {
            const statusColor = statusColors[c.status || "upcoming"] || statusColors.upcoming;
            const hasSubmitted = mySubmissions.has(c.id);

            return (
              <div key={c.id} className="neon-card rounded-2xl p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-foreground">{c.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full capitalize" style={{ background: `${statusColor}15`, color: statusColor }}>{c.status || "upcoming"}</span>
                    </div>
                    {c.description && <p className="text-sm text-muted-foreground">{c.description}</p>}
                  </div>
                  {c.xp_reward && (
                    <div className="text-right shrink-0 ml-4">
                      <div className="flex items-center gap-1 text-primary">
                        <Trophy className="w-4 h-4" />
                        <span className="font-bold">{c.xp_reward} XP</span>
                      </div>
                    </div>
                  )}
                </div>

                {c.rules && (
                  <div className="text-xs text-muted-foreground bg-secondary/50 rounded-lg p-3">
                    <strong className="text-foreground">Rules:</strong> {c.rules}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  {c.start_time && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      Starts: {new Date(c.start_time).toLocaleDateString()}
                    </div>
                  )}
                  {c.deadline && (
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-primary" />
                      <span className="text-primary font-medium">{getCountdown(c.deadline)}</span>
                    </div>
                  )}
                </div>

                {/* Submit section */}
                {hasSubmitted ? (
                  <div className="text-xs text-neon-green flex items-center gap-1" style={{ color: "hsl(var(--neon-green))" }}>
                    ✅ You've submitted to this contest
                  </div>
                ) : submitting === c.id ? (
                  <div className="space-y-3 animate-fade-in border-t border-border pt-4">
                    <input value={submitForm.github_link} onChange={(e) => setSubmitForm({ ...submitForm, github_link: e.target.value })} placeholder="GitHub repository link" className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <input value={submitForm.submission_url} onChange={(e) => setSubmitForm({ ...submitForm, submission_url: e.target.value })} placeholder="Live demo / submission URL" className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50" />
                    <textarea value={submitForm.notes} onChange={(e) => setSubmitForm({ ...submitForm, notes: e.target.value })} placeholder="Additional notes..." rows={2} className="w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => handleSubmit(c.id)} className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all glow-button">
                        <Send className="w-3.5 h-3.5 inline mr-1.5" />Submit
                      </button>
                      <button onClick={() => setSubmitting(null)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm hover:bg-secondary/80 transition-all">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setSubmitting(c.id)} className="px-4 py-2 rounded-xl bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-all">
                    Submit Entry →
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

export default CompetitionsPage;
