import React from "react";
import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";

const DashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen">
      <AppSidebar />
      <main className="ml-[240px] min-h-screen p-6 lg:p-8 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
