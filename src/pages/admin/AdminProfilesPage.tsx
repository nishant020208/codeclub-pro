import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User, Activity, Trophy, Target, ArrowLeft, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface MemberProfile {
  id: string;
  user_id: string;
  user_code: string;
  display_name: string | null;
  bio: string | null;
  created_at: string;
}

interface MemberDetail {
  profile: MemberProfile;
  quizAttempts: number;
  quizCorrect: number;
  dsaSubmissions: number;
  dsaAccepted: number;
  totalProjects: number;
  badges: number;
  achievements: number;
  activityDays: Record<string, number>;
  recentActivity: { type: string; date: string }[];
}

const AdminProfilesPage: React.FC = () => {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<MemberDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    supabase.from("profiles").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setMembers(data || []);
      setLoading(false);
    });
  }, []);

  const loadDetail = async (profile: MemberProfile) => {
    setDetailLoading(true);
    const uid = profile.user_id;

    const [quizRes, dsaRes, projRes, badgeRes, achievRes, actRes] = await Promise.all([
      supabase.from("quiz_attempts").select("id, is_correct").eq("user_id", uid),
      supabase.from("dsa_submissions").select("id, status").eq("user_id", uid),
      supabase.from("projects").select("id").eq("user_id", uid),
      supabase.from("user_badges").select("id").eq("user_id", uid),
      supabase.from("user_achievements").select("id").eq("user_id", uid),
      supabase.from("user_activity").select("activity_type, created_at").eq("user_id", uid).order("created_at", { ascending: false }).limit(50),
    ]);

    const qa = quizRes.data || [];
    const ds = dsaRes.data || [];
    const activity = actRes.data || [];

    // Build heatmap data (last 30 days)
    const activityDays: Record<string, number> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      activityDays[d.toISOString().slice(0, 10)] = 0;
    }
    activity.forEach((a: any) => {
      const day = a.created_at.slice(0, 10);
      if (activityDays[day] !== undefined) activityDays[day]++;
    });

    setSelected({
      profile,
      quizAttempts: qa.length,
      quizCorrect: qa.filter((a: any) => a.is_correct).length,
      dsaSubmissions: ds.length,
      dsaAccepted: ds.filter((s: any) => s.status === "accepted").length,
      totalProjects: (projRes.data || []).length,
      badges: (badgeRes.data || []).length,
      achievements: (achievRes.data || []).length,
      activityDays,
      recentActivity: activity.slice(0, 10).map((a: any) => ({
        type: a.activity_type,
        date: new Date(a.created_at).toLocaleDateString(),
      })),
    });
    setDetailLoading(false);
  };

  if (selected) {
    const d = selected;
    const quizAcc = d.quizAttempts > 0 ? Math.round((d.quizCorrect / d.quizAttempts) * 100) : 0;
    const dsaAcc = d.dsaSubmissions > 0 ? Math.round((d.dsaAccepted / d.dsaSubmissions) * 100) : 0;

    return (
      <div className="space-y-6 animate-fade-in">
        <button onClick={() => setSelected(null)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Members
        </button>

        {/* Profile header */}
        <div className="glass-card rounded-xl p-6 flex items-center gap-6">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{d.profile.display_name || d.profile.user_code}</h1>
            <p className="text-sm text-muted-foreground">@{d.profile.user_code}</p>
            {d.profile.bio && <p className="text-sm text-muted-foreground mt-1">{d.profile.bio}</p>}
            <p className="text-xs text-muted-foreground mt-1">Joined {new Date(d.profile.created_at).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Quiz Attempts", value: d.quizAttempts, sub: `${quizAcc}% accuracy` },
            { label: "DSA Submissions", value: d.dsaSubmissions, sub: `${dsaAcc}% accepted` },
            { label: "Projects", value: d.totalProjects },
            { label: "Badges", value: d.badges },
          ].map(s => (
            <Card key={s.label} className="bg-card border-border">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
                {s.sub && <p className="text-xs text-primary mt-1">{s.sub}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Progress rings */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-sm">Quiz Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--primary))" strokeWidth="3"
                      strokeDasharray={`${quizAcc} ${100 - quizAcc}`} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">{quizAcc}%</span>
                </div>
                <div>
                  <p className="text-sm text-foreground">{d.quizCorrect} / {d.quizAttempts} correct</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader><CardTitle className="text-sm">DSA Performance</CardTitle></CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--secondary))" strokeWidth="3" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--accent))" strokeWidth="3"
                      strokeDasharray={`${dsaAcc} ${100 - dsaAcc}`} strokeLinecap="round" className="transition-all duration-1000" />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-foreground">{dsaAcc}%</span>
                </div>
                <div>
                  <p className="text-sm text-foreground">{d.dsaAccepted} / {d.dsaSubmissions} accepted</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity heatmap */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-sm">Activity Heatmap (30 days)</CardTitle></CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-1">
              {Object.entries(d.activityDays).map(([day, count]) => (
                <div key={day} title={`${day}: ${count} activities`}
                  className="w-4 h-4 rounded-sm transition-colors"
                  style={{
                    backgroundColor: count === 0
                      ? "hsl(var(--secondary))"
                      : count <= 2
                      ? "hsl(172, 66%, 30%)"
                      : count <= 5
                      ? "hsl(172, 66%, 45%)"
                      : "hsl(172, 66%, 60%)",
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent activity */}
        <Card className="bg-card border-border">
          <CardHeader><CardTitle className="text-sm">Recent Activity</CardTitle></CardHeader>
          <CardContent>
            {d.recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No activity recorded</p>
            ) : (
              <div className="space-y-2">
                {d.recentActivity.map((a, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <Activity className="w-3 h-3 text-primary shrink-0" />
                    <span className="text-foreground capitalize">{a.type.replace(/_/g, " ")}</span>
                    <span className="text-muted-foreground ml-auto text-xs">{a.date}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Member <span className="gradient-text">Profiles</span>
        </h1>
        <p className="text-muted-foreground mt-1">View detailed analytics per member</p>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="shimmer h-16 rounded-xl" />)}</div>
      ) : (
        <div className="space-y-3">
          {members.map(m => (
            <button key={m.id} onClick={() => loadDetail(m)}
              className="w-full glass-card rounded-xl p-5 text-left hover:border-primary/30 transition-all duration-300 group flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{m.display_name || m.user_code}</h3>
                <p className="text-xs text-muted-foreground">@{m.user_code}</p>
              </div>
              <BarChart3 className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminProfilesPage;
