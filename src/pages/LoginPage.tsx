import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Terminal, ArrowRight, Eye, EyeOff, ArrowLeft, Mail } from "lucide-react";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().min(1, "Email or username required").max(255),
  password: z.string().min(1, "Password required").max(128),
});

const LoginPage: React.FC = () => {
  const { user, loading: authLoading, signIn, signInWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as any)?.from?.pathname || "/dashboard";

  const [mode, setMode] = useState<"login" | "forgot">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, navigate, from]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      await signIn(email, password);
      toast.success("Access granted.");
      // Hard reload to ensure all auth-dependent state refreshes
      window.location.assign(from);
    } catch (err: any) {
      toast.error(err.message || "Invalid credentials.");
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try { await signInWithGoogle(); } catch (err: any) {
      toast.error(err.message || "Google sign-in failed.");
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { toast.error("Enter your email"); return; }
    setLoading(true);
    try {
      await resetPassword(email);
      setResetSent(true);
      toast.success("Reset link sent to your email.");
    } catch (err: any) {
      toast.error(err.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 matrix-bg" />
      <div className="absolute inset-0 scanlines opacity-20" />

      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center glow-border">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display">
              <span className="text-primary">CodeClub</span> <span className="text-foreground">Pro</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-mono">
            {mode === "login" ? "$ authenticate --user" : "$ reset --password"}
          </p>
        </div>

        <div className="terminal-card rounded-lg p-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-neon-red/60" />
            <div className="w-3 h-3 rounded-full bg-neon-amber/60" />
            <div className="w-3 h-3 rounded-full bg-neon-green/60" />
            <span className="text-xs text-muted-foreground ml-2 font-mono">auth.sh</span>
          </div>

          {mode === "forgot" ? (
            <>
              <button onClick={() => { setMode("login"); setResetSent(false); }}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary mb-4 font-mono">
                <ArrowLeft className="w-3 h-3" /> back to login
              </button>
              {resetSent ? (
                <div className="text-center py-6 space-y-3">
                  <Mail className="w-12 h-12 text-primary mx-auto" />
                  <h3 className="text-foreground font-bold">Check your email</h3>
                  <p className="text-muted-foreground text-sm font-mono">A reset link was sent to {email}.</p>
                </div>
              ) : (
                <form onSubmit={handleForgot} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-primary font-mono">email:</label>
                    <input type="email" inputMode="email" autoComplete="email" autoCapitalize="none" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono min-h-[48px]" />
                  </div>
                  <button type="submit" disabled={loading}
                    className="w-full py-3.5 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 disabled:opacity-50 glow-border">
                    {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin mx-auto" /> : "$ send_reset_link"}
                  </button>
                </form>
              )}
            </>
          ) : (
            <>
              <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary font-mono">email:</label>
                  <input type="text" inputMode="email" autoComplete="email" autoCapitalize="none" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                    className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono min-h-[48px]" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-primary font-mono">password:</label>
                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="current-password"
                      className="w-full px-4 py-3 pr-12 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono min-h-[48px]" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-3.5 rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 glow-border">
                  {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : (<>$ authenticate <ArrowRight className="w-4 h-4" /></>)}
                </button>

                <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono">
                  <div className="flex-1 h-px bg-border" /> or <div className="flex-1 h-px bg-border" />
                </div>

                <button type="button" onClick={handleGoogle} disabled={loading}
                  className="w-full py-3 rounded-md bg-background border border-border text-foreground font-medium flex items-center justify-center gap-2 hover:bg-muted transition-colors disabled:opacity-50">
                  <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                  Continue with Google
                </button>

                <div className="flex items-center justify-between text-xs font-mono pt-2">
                  <button type="button" onClick={() => setMode("forgot")} className="text-muted-foreground hover:text-primary">forgot_password?</button>
                  <Link to="/signup" className="text-primary hover:underline">create_account →</Link>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
