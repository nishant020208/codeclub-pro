import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Code2, Trophy, Users, TrendingUp, Zap, Star, Medal } from "lucide-react";

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string; gradient?: string }> = ({
  icon: Icon, label, value, gradient
}) => (
  <div className="neon-card rounded-2xl p-6 animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1 text-foreground animate-count-up">{value}</p>
      </div>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: gradient ? `${gradient}15` : "hsla(265, 90%, 65%, 0.1)" }}>
        <Icon className="w-5 h-5" style={{ color: gradient || "hsl(var(--primary))" }} />
      </div>
    </div>
  </div>
);

const MemberDashboard: React.FC = () => {
  const { userCode, user } = useAuth();
  const [courseCount, setCourseCount] = useState(0);
  const [myXp, setMyXp] = useState(0);
  const [badgeCount, setBadgeCount] = useState(0);

  useEffect(() => {
    Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      user ? supabase.from("xp_logs").select("amount").eq("user_id", user.id) : Promise.resolve({ data: [] }),
      user ? supabase.from("user_badges").select("id", { count: "exact", head: true }).eq("user_id", user.id) : Promise.resolve({ count: 0 }),
    ]).then(([c, xp, b]) => {
      setCourseCount(c.count || 0);
      setMyXp(((xp as any).data || []).reduce((s: number, x: any) => s + x.amount, 0));
      setBadgeCount((b as any).count || 0);
    });
  }, [user]);

  const colors = {
    purple: "hsl(265, 90%, 65%)",
    cyan: "hsl(190, 95%, 50%)",
    pink: "hsl(330, 90%, 60%)",
    orange: "hsl(25, 95%, 55%)",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text-neon">{userCode}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your coding journey overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Star} label="Total XP" value={String(myXp)} gradient={colors.purple} />
        <StatCard icon={BookOpen} label="Courses" value={String(courseCount)} gradient={colors.cyan} />
        <StatCard icon={Medal} label="Badges" value={String(badgeCount)} gradient={colors.pink} />
        <StatCard icon={Zap} label="Streak" value="1 day" gradient={colors.orange} />
      </div>

      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: "Browse Courses", desc: "Start learning new skills", href: "/dashboard/courses", color: colors.cyan },
            { icon: Code2, title: "Add Project", desc: "Showcase your work", href: "/dashboard/code", color: colors.purple },
            { icon: Trophy, title: "Competitions", desc: "Join coding challenges", href: "/dashboard/competitions", color: colors.pink },
          ].map((item) => (
            <a key={item.title} href={item.href} className="neon-card rounded-2xl p-5 group">
              <item.icon className="w-8 h-8 mb-3 group-hover:scale-110 transition-transform" style={{ color: item.color }} />
              <h3 className="font-semibold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({ courses: 0, members: 0, quizzes: 0, contests: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("quizzes").select("id", { count: "exact", head: true }),
      supabase.from("competitions").select("id", { count: "exact", head: true }),
    ]).then(([c, m, q, co]) => {
      setStats({ courses: c.count || 0, members: m.count || 0, quizzes: q.count || 0, contests: co.count || 0 });
    });
  }, []);

  const colors = {
    purple: "hsl(265, 90%, 65%)",
    cyan: "hsl(190, 95%, 50%)",
    pink: "hsl(330, 90%, 60%)",
    orange: "hsl(25, 95%, 55%)",
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Admin <span className="gradient-text-neon">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage your coding club</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total Courses" value={String(stats.courses)} gradient={colors.cyan} />
        <StatCard icon={Users} label="Total Members" value={String(stats.members)} gradient={colors.purple} />
        <StatCard icon={TrendingUp} label="Total Quizzes" value={String(stats.quizzes)} gradient={colors.pink} />
        <StatCard icon={Trophy} label="Contests" value={String(stats.contests)} gradient={colors.orange} />
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  return role === "admin" ? <AdminDashboard /> : <MemberDashboard />;
};

export default DashboardPage;
