import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, BookOpen, Code2, User, Trophy, Medal,
  Swords, Bot, Settings, Users, FileText, BarChart3,
  LogOut, ChevronLeft, ChevronRight, Terminal, UserCheck, Award, Crown,
  Calendar, Megaphone, FolderOpen, GraduationCap, Flame, MessageSquare, UsersRound, FileCode, Shield
} from "lucide-react";
import { useState } from "react";

const memberLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/dsa", icon: Terminal, label: "Challenges" },
  { to: "/dashboard/battles", icon: Swords, label: "Battle Mode" },
  { to: "/dashboard/competitions", icon: Flame, label: "Contests" },
  { to: "/dashboard/leaderboard", icon: Crown, label: "Leaderboard" },
  { to: "/dashboard/courses", icon: BookOpen, label: "Courses" },
  { to: "/dashboard/forum", icon: MessageSquare, label: "Forum" },
  { to: "/dashboard/teams", icon: UsersRound, label: "Teams" },
  { to: "/dashboard/code", icon: Code2, label: "Projects" },
  { to: "/dashboard/events", icon: Calendar, label: "Events" },
  { to: "/dashboard/resources", icon: FolderOpen, label: "Resources" },
  { to: "/dashboard/announcements", icon: Megaphone, label: "Announcements" },
  { to: "/dashboard/ai-chat", icon: Bot, label: "AI Chat" },
  { to: "/dashboard/badges", icon: Medal, label: "Badges" },
  { to: "/dashboard/achievements", icon: Trophy, label: "Achievements" },
  { to: "/dashboard/certificates", icon: GraduationCap, label: "Certificates" },
  { to: "/dashboard/resume", icon: FileCode, label: "Resume" },
  { to: "/dashboard/profile", icon: User, label: "Profile" },
];

const adminLinks = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/dashboard/manage-courses", icon: BookOpen, label: "Courses" },
  { to: "/dashboard/manage-quizzes", icon: FileText, label: "Quizzes" },
  { to: "/dashboard/manage-dsa", icon: Terminal, label: "DSA" },
  { to: "/dashboard/manage-contests", icon: Swords, label: "Contests" },
  { to: "/dashboard/manage-events", icon: Calendar, label: "Events" },
  { to: "/dashboard/manage-announcements", icon: Megaphone, label: "Announcements" },
  { to: "/dashboard/manage-resources", icon: FolderOpen, label: "Resources" },
  { to: "/dashboard/manage-members", icon: Users, label: "Members" },
  { to: "/dashboard/manage-profiles", icon: UserCheck, label: "Profiles" },
  { to: "/dashboard/manage-badges", icon: Medal, label: "Badges" },
  { to: "/dashboard/manage-achievements", icon: Award, label: "Achievements" },
  { to: "/dashboard/cheat-logs", icon: Shield, label: "Anti-Cheat" },
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
        collapsed ? "w-[56px]" : "w-[220px]"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-3 h-14 border-b border-sidebar-border shrink-0">
        <div className="w-7 h-7 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Terminal className="w-3.5 h-3.5 text-primary" />
        </div>
        {!collapsed && (
          <span className="text-sm font-bold truncate">
            <span className="text-primary">CodeClub</span> Pro
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2 px-1.5 space-y-0.5 overflow-y-auto scrollbar-thin">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/dashboard"}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              }`
            }
          >
            <link.icon className="w-3.5 h-3.5 shrink-0" />
            {!collapsed && <span className="truncate">{link.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-sidebar-border p-2 space-y-1">
        {!collapsed && (
          <div className="px-2 py-1">
            <p className="text-[10px] text-muted-foreground font-mono">logged_in_as:</p>
            <p className="text-xs font-bold text-primary truncate">{userCode}</p>
            <p className="text-[10px] text-muted-foreground capitalize font-mono">{role}</p>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md text-xs text-destructive hover:bg-destructive/10 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!collapsed && "$ logout"}
        </button>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-2 w-full px-2.5 py-2 rounded-md text-xs text-muted-foreground hover:bg-sidebar-accent transition-colors"
        >
          {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
};

export default AppSidebar;
