import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Terminal, ArrowRight, Eye, EyeOff } from "lucide-react";
import { z } from "zod";

const signupSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required").max(100),
  email: z.string().trim().min(3, "Email is required").max(255),
  mobile: z.string().trim().min(7, "Mobile number is required").max(20).regex(/^[0-9+\-\s()]+$/, "Invalid mobile number"),
  username: z.string().trim().min(3, "Username must be 3+ chars").max(32).regex(/^[a-z0-9_-]+$/i, "Letters, numbers, _ and - only"),
  password: z.string().min(8, "Password must be 8+ characters").max(128),
  confirm: z.string(),
  terms: z.literal(true, { errorMap: () => ({ message: "You must accept the terms" }) }),
}).refine(d => d.password === d.confirm, { message: "Passwords do not match", path: ["confirm"] });

function passwordStrength(p: string): { score: number; label: string; color: string } {
  let score = 0;
  if (p.length >= 8) score++;
  if (p.length >= 12) score++;
  if (/[A-Z]/.test(p) && /[a-z]/.test(p)) score++;
  if (/\d/.test(p)) score++;
  if (/[^A-Za-z0-9]/.test(p)) score++;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong", "Excellent"];
  const colors = ["bg-destructive", "bg-destructive", "bg-neon-amber", "bg-neon-amber", "bg-primary", "bg-primary"];
  return { score, label: labels[score], color: colors[score] };
}

const SignupPage: React.FC = () => {
  const { user, loading: authLoading, signUp } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [terms, setTerms] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userTouchedUsername, setUserTouchedUsername] = useState(false);

  useEffect(() => {
    if (!authLoading && user) navigate("/dashboard", { replace: true });
  }, [user, authLoading, navigate]);

  // Auto-suggest username from full name
  useEffect(() => {
    if (!userTouchedUsername && fullName) {
      setUsername(fullName.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "").slice(0, 24));
    }
  }, [fullName, userTouchedUsername]);

  const strength = useMemo(() => passwordStrength(password), [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = signupSchema.safeParse({ fullName, email, mobile, username, password, confirm, terms });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    setLoading(true);
    try {
      await signUp({ email, password, fullName, username, mobile });
      toast.success("Account created! Check your email to confirm.");
      window.location.assign("/login");
    } catch (err: any) {
      toast.error(err.message || "Sign-up failed.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-10">
      <div className="absolute inset-0 matrix-bg" />
      <div className="absolute inset-0 scanlines opacity-20" />

      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center glow-border">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display">
              <span className="text-primary">CodeClub</span> <span className="text-foreground">Pro</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-mono">$ register --new-user</p>
        </div>

        <div className="terminal-card rounded-lg p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary font-mono">full_name:</label>
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Ada Lovelace"
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[48px]" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary font-mono">email:</label>
              <input type="text" inputMode="email" autoComplete="email" autoCapitalize="none" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[48px]" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary font-mono">mobile_number:</label>
              <input type="tel" inputMode="tel" autoComplete="tel" value={mobile} onChange={e => setMobile(e.target.value)} placeholder="+1 555 123 4567"
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[48px]" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary font-mono">user_id:</label>
              <input value={username} onChange={e => { setUsername(e.target.value); setUserTouchedUsername(true); }} placeholder="ada_lovelace"
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[48px]" />
            </div>


            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary font-mono">password:</label>
              <div className="relative">
                <input type={show ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" autoComplete="new-password"
                  className="w-full px-4 py-2.5 pr-10 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary">
                  {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded ${i < strength.score ? strength.color : "bg-muted"}`} />
                    ))}
                  </div>
                  <p className="text-[10px] text-muted-foreground font-mono">{strength.label}</p>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-primary font-mono">confirm_password:</label>
              <input type={show ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••"
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground focus:ring-1 focus:ring-primary font-mono text-sm min-h-[48px]" />
            </div>

            <label className="flex items-start gap-2 text-xs font-mono text-muted-foreground cursor-pointer">
              <input type="checkbox" checked={terms} onChange={e => setTerms(e.target.checked)} className="mt-0.5 accent-primary" />
              <span>I agree to the Terms & Conditions and Privacy Policy.</span>
            </label>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 disabled:opacity-50 glow-border">
              {loading ? <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> : (<>$ create_account <ArrowRight className="w-4 h-4" /></>)}
            </button>



            <p className="text-center text-xs font-mono text-muted-foreground pt-2">
              Already have an account? <Link to="/login" className="text-primary hover:underline">login →</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
