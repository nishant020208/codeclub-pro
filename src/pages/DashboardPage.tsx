import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { 
  Terminal, 
  Code2, 
  Trophy, 
  Users, 
  TrendingUp, 
  Zap, 
  Star, 
  Medal, 
  Flame, 
  BookOpen, 
  Calendar, 
  User 
} from "lucide-react";
import DailyChallenge from "@/components/DailyChallenge";

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string; href?: string }> = ({
  icon: Icon, label, value, href
}) => {
  const content = (
    <div className={`terminal-card rounded-lg p-5 animate-fade-in h-full transition-all duration-300 ${href ? 'hover:border-primary/40 hover:bg-primary/5 group cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground font-mono uppercase tracking-wider">{label}</p>
          <p className="text-2xl font-bold mt-1 text-primary animate-count-up">{value}</p>
        </div>
        <div className={`w-9 h-9 rounded-md flex items-center justify-center bg-primary/10 border border-primary/20 transition-all ${href ? 'group-hover:bg-primary/20 group-hover:border-primary/40' : ''}`}>
          <Icon className="w-4 h-4 text-primary" />
        </div>
      </div>
    </div>
  );

  if (href) {
    return <Link to={href} className="block h-full">{content}</Link>;
  }
  return content;
};

const QuickActions: React.FC = () => {
  const quickActions = [
    { icon: BookOpen, title: "$ courses", desc: "Learning modules", href: "/dashboard/courses" },
    { icon: Terminal, title: "$ dsa_practice", desc: "Problems section", href: "/dashboard/dsa" },
    { icon: Code2, title: "$ projects", desc: "Showcase gallery", href: "/dashboard/projects" },
    { icon: Trophy, title: "$ leaderboard", desc: "Rankings board", href: "/dashboard/leaderboard" },
    { icon: Calendar, title: "$ events", desc: "Workshops & meets", href: "/dashboard/events" },
    { icon: User, title: "$ profile", desc: "User profile page", href: "/dashboard/profile" },
  ];

  return (
    <div>
      <p className="text-sm text-muted-foreground font-mono mb-3 animate-fade-in">$ ls ./quick-actions</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {quickActions.map((item, idx) => (
          <Link 
            key={item.title} 
            to={item.href} 
            className="terminal-card rounded-xl p-4 group hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98] transition-all duration-300 block animate-fade-in"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-lg bg-secondary/50 border border-border flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/30 transition-all shrink-0">
                <item.icon className="w-5 h-5 text-primary transition-transform group-hover:scale-110" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

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

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground font-mono mb-1">$ welcome --user</p>
        <h1 className="text-2xl font-bold text-foreground">
          Hello, <span className="text-primary">{userCode}</span>
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon={Star} label="total_xp" value={String(myXp)} href="/dashboard/leaderboard" />
        <StatCard icon={Flame} label="streak" value={`${streak}d`} />
        <StatCard icon={Medal} label="badges" value={String(badgeCount)} href="/dashboard/badges" />
        <StatCard icon={BookOpen} label="courses" value={String(courseCount)} href="/dashboard/courses" />
      </div>

      {/* Daily Challenge */}
      <DailyChallenge />

      {/* Quick Actions */}
      <QuickActions />
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
        <StatCard icon={BookOpen} label="courses" value={String(stats.courses)} href="/dashboard/manage-courses" />
        <StatCard icon={Users} label="members" value={String(stats.members)} href="/dashboard/manage-members" />
        <StatCard icon={TrendingUp} label="quizzes" value={String(stats.quizzes)} href="/dashboard/manage-quizzes" />
        <StatCard icon={Trophy} label="contests" value={String(stats.contests)} href="/dashboard/manage-contests" />
        <StatCard icon={Zap} label="cheat_alerts" value={String(stats.cheats)} href="/dashboard/cheat-logs" />
      </div>

      {/* Quick Actions for Admin too */}
      <QuickActions />
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  return role === "admin" ? <AdminDashboard /> : <MemberDashboard />;
};

export default DashboardPage;
