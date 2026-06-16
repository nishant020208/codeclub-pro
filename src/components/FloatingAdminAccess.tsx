import React, { useState } from "react";
import { Terminal, X, Loader2, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const FloatingAdminAccess: React.FC = () => {
  const { user, role, refreshUserMeta } = useAuth();
  const [open, setOpen] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);

  if (!user || role === "admin") return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode.trim()) return;
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-access", {
        body: { action: "grant_admin", passcode: passcode.trim() },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      toast.success("Admin access granted");
      await refreshUserMeta();
      setOpen(false);
      setPasscode("");
      setTimeout(() => window.location.assign("/dashboard"), 400);
    } catch (err: any) {
      toast.error(err?.message ?? "Invalid passcode");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Admin access"
        className="fixed bottom-5 right-5 z-50 h-12 w-12 rounded-full bg-primary/15 border border-primary/40 backdrop-blur-md text-primary shadow-[0_0_20px_rgba(0,204,51,0.35)] hover:bg-primary/25 hover:scale-105 transition-all flex items-center justify-center font-mono"
      >
        <Terminal className="w-5 h-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-background/70 backdrop-blur-sm p-4"
          onClick={() => !loading && setOpen(false)}
        >
          <form
            onClick={(e) => e.stopPropagation()}
            onSubmit={submit}
            className="w-full max-w-sm rounded-2xl border border-primary/40 bg-card/95 p-6 shadow-2xl font-mono animate-fade-in"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="w-5 h-5" />
                <span className="text-sm font-bold tracking-wider">ADMIN ACCESS</span>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-4">
              Enter admin passcode to elevate your account.
            </p>
            <input
              type="password"
              inputMode="numeric"
              autoFocus
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="••••••"
              className="w-full px-4 py-3 min-h-[48px] rounded-xl bg-secondary/60 border border-border text-foreground tracking-[0.4em] text-center text-lg focus:outline-none focus:ring-2 focus:ring-primary/60"
            />
            <button
              type="submit"
              disabled={loading || !passcode.trim()}
              className="mt-4 w-full min-h-[48px] rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-50 hover:opacity-90 transition"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "AUTHENTICATE"}
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default FloatingAdminAccess;
