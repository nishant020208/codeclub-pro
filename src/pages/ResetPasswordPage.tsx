import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Terminal, Eye, EyeOff } from "lucide-react";

const ResetPasswordPage: React.FC = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [valid, setValid] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) setValid(true);
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") setValid(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      toast.success("Password updated successfully!");
      setDone(true);
      setTimeout(() => navigate("/login"), 2200);
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  if (!valid) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="terminal-card rounded-lg p-8 max-w-md mx-4 text-center">
          <Terminal className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-foreground font-bold mb-2">Invalid Reset Link</h2>
          <p className="text-muted-foreground text-sm font-mono mb-4">
            This link is invalid or has expired. Request a new one.
          </p>
          <button onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-colors">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden px-4 py-8">
      <div className="absolute inset-0 matrix-bg" />
      <div className="relative z-10 w-full max-w-md">
        <div className="terminal-card rounded-lg p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-neon-red/60" />
            <div className="w-3 h-3 rounded-full bg-neon-amber/60" />
            <div className="w-3 h-3 rounded-full bg-neon-green/60" />
            <span className="text-xs text-muted-foreground ml-2 font-mono">reset.sh</span>
          </div>

          {done ? (
            <div className="text-center py-6 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <Terminal className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-xl font-bold text-foreground">Password Updated</h2>
              <p className="text-muted-foreground text-sm font-mono">Redirecting you to login…</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-foreground mb-1">Set New Password</h2>
              <p className="text-muted-foreground text-sm font-mono mb-6">Enter your new password below</p>
              <form onSubmit={handleReset} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary font-mono">new_password:</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password}
                      onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password"
                      className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono pr-12 min-h-[48px]"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary min-h-[40px] min-w-[40px] flex items-center justify-center">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary font-mono">confirm_password:</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••" autoComplete="new-password"
                    className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono min-h-[48px]"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 glow-border min-h-[48px]">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : "$ update_password"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
