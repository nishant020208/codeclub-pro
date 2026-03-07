import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <div className="ml-[240px] transition-all duration-300">
        {/* Top bar with notification bell */}
        <header className="sticky top-0 z-30 h-14 border-b border-border/50 backdrop-blur-xl bg-background/60 flex items-center justify-end px-6">
          <NotificationBell />
        </header>
        <main className="p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
