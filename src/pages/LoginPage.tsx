import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Terminal, ArrowRight, Eye, EyeOff } from "lucide-react";

const LoginPage: React.FC = () => {
  const { signIn, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [userCode, setUserCode] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userCode || !password || (mode === "register" && !code)) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await signIn(userCode, password);
        toast.success("Access granted.");
        navigate("/dashboard");
      } else {
        await register(userCode, code, password);
        toast.success("Account created. Logging in...");
        await signIn(userCode, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      toast.error(err.message || "Access denied.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 matrix-bg" />
      {/* Scanlines */}
      <div className="absolute inset-0 scanlines opacity-20" />
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: "linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }} />

      <div className="relative z-10 w-full max-w-md mx-4 animate-scale-in">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center glow-border">
              <Terminal className="w-6 h-6 text-primary" />
            </div>
            <h1 className="text-3xl font-bold font-display">
              <span className="text-primary">CodeClub</span>{" "}
              <span className="text-foreground">Pro</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm font-mono">
            {mode === "login" ? "$ authenticate --user" : "$ register --new-user"}
          </p>
        </div>

        {/* Card */}
        <div className="terminal-card rounded-lg p-8">
          {/* Terminal header dots */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-neon-red/60" />
            <div className="w-3 h-3 rounded-full bg-neon-amber/60" />
            <div className="w-3 h-3 rounded-full bg-neon-green/60" />
            <span className="text-xs text-muted-foreground ml-2 font-mono">auth.sh</span>
          </div>

          {/* Tab switcher */}
          <div className="flex gap-1 mb-8 p-1 rounded-md bg-secondary/50">
            <button
              onClick={() => setMode("login")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-bold transition-all duration-300 ${
                mode === "login" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              LOGIN
            </button>
            <button
              onClick={() => setMode("register")}
              className={`flex-1 py-2.5 px-4 rounded-md text-sm font-bold transition-all duration-300 ${
                mode === "register" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              REGISTER
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-primary font-mono">member_id:</label>
              <input
                type="text"
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                placeholder="enter_your_id"
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono"
              />
            </div>

            {mode === "register" && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-sm font-medium text-primary font-mono">reg_code:</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="admin_provided_code"
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono"
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium text-primary font-mono">
                {mode === "register" ? "new_password:" : "password:"}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all font-mono pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-md bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 glow-border"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              ) : (
                <>
                  {mode === "login" ? "$ authenticate" : "$ create_account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {mode === "register" && (
            <p className="mt-6 text-xs text-center text-muted-foreground font-mono">
              // Get your registration code from the admin
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
