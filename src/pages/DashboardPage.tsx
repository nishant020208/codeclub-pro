import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, Code2, Trophy, Users, TrendingUp, Zap } from "lucide-react";

const StatCard: React.FC<{ icon: React.ElementType; label: string; value: string; color?: string }> = ({
  icon: Icon, label, value, color = "primary"
}) => (
  <div className="glass-card rounded-xl p-6 animate-fade-in">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-3xl font-bold mt-1 text-foreground">{value}</p>
      </div>
      <div className={`w-10 h-10 rounded-lg bg-${color}/10 flex items-center justify-center`}>
        <Icon className={`w-5 h-5 text-${color}`} />
      </div>
    </div>
  </div>
);

const MemberDashboard: React.FC = () => {
  const { userCode } = useAuth();
  const [courseCount, setCourseCount] = useState(0);

  useEffect(() => {
    supabase.from("courses").select("id", { count: "exact", head: true }).then(({ count }) => {
      setCourseCount(count || 0);
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, <span className="gradient-text">{userCode}</span>
        </h1>
        <p className="text-muted-foreground mt-1">Here's your coding journey overview</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Available Courses" value={String(courseCount)} />
        <StatCard icon={Code2} label="Projects" value="0" />
        <StatCard icon={Trophy} label="Achievements" value="0" />
        <StatCard icon={Zap} label="Streak" value="1 day" />
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: BookOpen, title: "Browse Courses", desc: "Start learning new skills", href: "/dashboard/courses" },
            { icon: Code2, title: "Add Project", desc: "Showcase your work", href: "/dashboard/code" },
            { icon: Trophy, title: "Competitions", desc: "Join coding challenges", href: "/dashboard/competitions" },
          ].map((item) => (
            <a
              key={item.title}
              href={item.href}
              className="glass-card rounded-xl p-5 hover:border-primary/30 transition-all duration-300 group"
            >
              <item.icon className="w-8 h-8 text-primary mb-3 group-hover:scale-110 transition-transform" />
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
  const [stats, setStats] = useState({ courses: 0, members: 0, quizzes: 0 });

  useEffect(() => {
    Promise.all([
      supabase.from("courses").select("id", { count: "exact", head: true }),
      supabase.from("profiles").select("id", { count: "exact", head: true }),
      supabase.from("quizzes").select("id", { count: "exact", head: true }),
    ]).then(([c, m, q]) => {
      setStats({
        courses: c.count || 0,
        members: m.count || 0,
        quizzes: q.count || 0,
      });
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Admin <span className="gradient-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground mt-1">Manage your coding club</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={BookOpen} label="Total Courses" value={String(stats.courses)} />
        <StatCard icon={Users} label="Total Members" value={String(stats.members)} />
        <StatCard icon={TrendingUp} label="Total Quizzes" value={String(stats.quizzes)} />
        <StatCard icon={Zap} label="Active Today" value="—" />
      </div>
    </div>
  );
};

const DashboardPage: React.FC = () => {
  const { role } = useAuth();
  return role === "admin" ? <AdminDashboard /> : <MemberDashboard />;
};

export default DashboardPage;
