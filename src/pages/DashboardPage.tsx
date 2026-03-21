import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Terminal, Code2, Trophy, Users, TrendingUp, Zap, Star, Medal, Flame, Swords, BookOpen } from "lucide-react";
import DailyChallenge from "@/components/DailyChallenge";

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string; color?: string }> = ({
  icon: Icon, label, value, color
}) => (
  <div className="terminal-card rounded-lg p-5 animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold mt-1 text-primary animate-count-up">{value}</p>
      </div>
      <div className="w-9 h-9 rounded-md flex items-center justify-center bg-primary/10 border border-primary/20">
        <Icon className="w-4 h-4 text-primary" />
      </div>
    </div>
  </div>
);

const MemberDashboard: React.FC = () => {
  const { userCode, user } = useAuth();
  const [courseCount, setCourseCount] = useState(0);
  const [myXp, setMyXp] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!user) return;
    Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("xp_logs").select("amount").eq("user_id", user.id),
      supabase.from("user_badges").select("id", { count: "exact", head: true }).eq("user_id", user.id),
      supabase.from("streaks").select("current_streak").eq("user_id", user.id).maybeSingle(),
    ]).then(([c, xp, b, s]) => {
      setCourseCount(c.count || 0);
      setMyXp(((xp as any).data || []).reduce((sum: number, x: any) => sum + x.amount, 0));
      setBadgeCount((b as any).count || 0);
      setStreak((s as any).data?.current_streak || 0);
    });
  }, [user]);

  const quickActions = [
    { icon: Terminal, title: "$ solve", desc: "DSA Challenges", href: "/dashboard/dsa" },
    { icon: Swords, title: "$ battle", desc: "1v1 Peer Battle", href: "/dashboard/battles" },
    { icon: Trophy, title: "$ rank", desc: "Leaderboard", href: "/dashboard/leaderboard" },
    { icon: Code2, title: "$ showcase", desc: "My Projects", href: "/dashboard/code" },
    { icon: BookOpen, title: "$ learn", desc: "Courses", href: "/dashboard/courses" },
    { icon: Flame, title: "$ streak", desc: `${streak} day streak`, href: "/dashboard/dsa" },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground font-mono mb-1">$ welcome --user</p>
        <h1 className="text-2xl font-bold text-foreground">
          Hello, <span className="text-primary">{userCode}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Star} label="total_xp" value={String(myXp)} />
        <StatCard icon={Flame} label="streak" value={`${streak}d`} />
        <StatCard icon={Medal} label="badges" value={String(badgeCount)} />
        <StatCard icon={BookOpen} label="courses" value={String(courseCount)} />
      </div>

      {/* Daily Challenge */}
      <DailyChallenge />

      <div>
        <p className="text-sm text-muted-foreground font-mono mb-3">$ ls ./quick-actions</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {quickActions.map((item) => (
            <a key={item.title} href={item.href} className="terminal-card rounded-lg p-4 group hover:border-primary/30 transition-all">
              <div className="flex items-center gap-3">
                <item.icon className="w-5 h-5 text-primary shrink-0" />
                <div>
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ courses: 0, members: 0, quizzes: 0, contests: 0, cheats: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("quizzes").select("id", { count: "exact", head: true }),
      supabase.from("competitions").select("id", { count: "exact", head: true }),
      supabase.from("cheat_logs").select("id", { count: "exact", head: true }),
    ]).then(([c, m, q, co, ch]) => {
      setStats({
        courses: c.count || 0,
        members: m.count || 0,
        quizzes: q.count || 0,
        contests: co.count || 0,
        cheats: (ch as any).count || 0,
      });
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground font-mono mb-1">$ sudo dashboard --admin</p>
        <h1 className="text-2xl font-bold text-foreground">
          Admin <span className="text-primary">Control Panel</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <StatCard icon={BookOpen} label="courses" value={String(stats.courses)} />
        <StatCard icon={Users} label="members" value={String(stats.members)} />
        <StatCard icon={TrendingUp} label="quizzes" value={String(stats.quizzes)} />
        <StatCard icon={Trophy} label="contests" value={String(stats.contests)} />
        <StatCard icon={Zap} label="cheat_alerts" value={String(stats.cheats)} />
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  return role === "admin" ? <AdminDashboard /> : <MemberDashboard />;
};

export default DashboardPage;
