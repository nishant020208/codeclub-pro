import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import { Menu, Terminal } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none scanlines opacity-10 z-[60]" />
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-[220px] transition-all duration-300">
        <header className="sticky top-0 z-30 h-12 border-b border-border/50 backdrop-blur-xl bg-background/80 flex items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-1.5 rounded-md hover:bg-secondary/50 transition-colors"
            >
              <Menu className="w-5 h-5 text-muted-foreground" />
            </button>
            <div className="text-xs text-muted-foreground font-mono hidden sm:block">
              <span className="text-primary">$</span> ~/dashboard
            </div>
            <div className="sm:hidden flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-primary" />
              <span className="text-xs font-bold"><span className="text-primary">CC</span>Pro</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
            <NotificationBell />
          </div>
        </header>
        <main className="p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
