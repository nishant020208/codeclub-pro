import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import NotificationBell from "@/components/NotificationBell";
import { Menu, Terminal, LogOut } from "lucide-react";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const DashboardLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    setSigningOut(true);
    try {
      await signOut();
      toast.success("Signed out.");
      navigate("/login");
    } catch (e: any) {
      toast.error(e.message || "Sign-out failed");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <div className="min-h-screen relative">
      <div className="fixed inset-0 pointer-events-none scanlines opacity-10 z-[60]" />
      <AppSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="md:ml-[220px] transition-all duration-300">
        <header className="sticky top-0 z-30 h-12 border-b border-border/50 backdrop-blur-xl bg-background/80 flex items-center justify-between px-3 md:px-6">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
              className="md:hidden p-2 -ml-2 rounded-md hover:bg-secondary/50 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center"
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
          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeSwitcher />
            <NotificationBell />
            <button
              onClick={handleSignOut}
              disabled={signingOut}
              aria-label="Sign out"
              className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-md border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors text-xs font-mono font-bold disabled:opacity-50 min-h-[36px]"
            >
              {signingOut ? (
                <div className="w-3.5 h-3.5 border-2 border-destructive/30 border-t-destructive rounded-full animate-spin" />
              ) : (
                <LogOut className="w-3.5 h-3.5" />
              )}
              <span className="hidden sm:inline">$ logout</span>
            </button>
          </div>
        </header>
        <main className="p-3 sm:p-5 lg:p-6">
          <Outlet />
        </main>
      </div>
      <FloatingAdminAccess />
    </div>
  );
};

export default DashboardLayout;

