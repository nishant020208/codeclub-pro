import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, BookOpen, Code2, User, Trophy, Medal,
  Swords, Bot, Settings, Users, FileText, BarChart3,
  LogOut, ChevronLeft, ChevronRight, Terminal, UserCheck, Award
} from "lucide-react";
import { useState } from "react";

const memberLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/courses", icon: BookOpen, label: "Courses" },
  { to: "/dashboard/dsa", icon: Terminal, label: "DSA Practice" },
  { to: "/dashboard/code", icon: Code2, label: "Projects" },
  { to: "/dashboard/ai-chat", icon: Bot, label: "AI Chat" },
  { to: "/dashboard/badges", icon: Medal, label: "Badges" },
  { to: "/dashboard/achievements", icon: Trophy, label: "Achievements" },
  { to: "/dashboard/competitions", icon: Swords, label: "Competitions" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

const adminLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/manage-courses", icon: BookOpen, label: "Courses" },
  { to: "/dashboard/manage-quizzes", icon: FileText, label: "Quizzes" },
  { to: "/dashboard/manage-dsa", icon: Terminal, label: "DSA" },
  { to: "/dashboard/manage-members", icon: Users, label: "Members" },
  { to: "/dashboard/manage-profiles", icon: UserCheck, label: "Profiles" },
  { to: "/dashboard/manage-badges", icon: Medal, label: "Badges" },
  { to: "/dashboard/manage-achievements", icon: Award, label: "Achievements" },
  { to: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { to: "/dashboard/settings", icon: Settings, label: "Settings" },
];

const AppSidebar: React.FC = () => {
  const { role, userCode, signOut } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const links = role === "admin" ? adminLinks : memberLinks;

  const handleSignOut = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-[72px]" : "w-[240px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-sidebar-border shrink-0">
        <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Code2 className="w-4 h-4 text-primary" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold truncate">
            <span className="gradient-text">CodeClub</span> Pro
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto scrollbar-thin">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`
            }
          >
            <link.icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-3 space-y-2">
        {!collapsed && (
          <div className="px-2 py-1">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="text-sm font-medium text-foreground truncate">{userCode}</p>
            <p className="text-xs text-primary capitalize">{role}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && "Sign Out"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
