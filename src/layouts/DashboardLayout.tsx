import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen relative">
      {/* Subtle scanlines */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-10 z-50" />
      <AppSidebar />
      <div className="ml-[220px] transition-all duration-300">
        <header className="sticky top-0 z-30 h-12 border-b border-border/50 backdrop-blur-xl bg-background/80 flex items-center justify-between px-6">
          <div className="text-xs text-muted-foreground font-mono">
            <span className="text-primary">$</span> ~/dashboard
          </div>
          <NotificationBell />
        </header>
        <main className="p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
