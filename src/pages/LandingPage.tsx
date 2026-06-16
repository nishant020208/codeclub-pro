import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Terminal, Swords, Trophy, Code2, Users, Zap, ArrowRight, Star, Rocket, Shield, BarChart3, Flame, MessageSquare } from "lucide-react";
import FloatingAdminAccess from "@/components/FloatingAdminAccess";

const features = [
  { icon: Terminal, title: "Coding Challenges", desc: "Solve DSA problems with AI-powered evaluation and instant feedback." },
  { icon: Swords, title: "1v1 Battle Mode", desc: "Challenge peers to real-time coding duels. Fastest correct solution wins." },
  { icon: Trophy, title: "XP & Leaderboard", desc: "Earn XP, level up from Beginner to Legend, compete on weekly boards." },
  { icon: Flame, title: "Streak System", desc: "Maintain daily coding streaks. Build consistency and unlock rewards." },
  { icon: Rocket, title: "Project Showcase", desc: "Upload projects with GitHub links. Get featured in the club gallery." },
  { icon: MessageSquare, title: "Discussion Forum", desc: "Discuss problems, share solutions, upvote the best answers." },
  { icon: Users, title: "Team System", desc: "Form teams, compete in team contests, climb the team leaderboard." },
  { icon: Shield, title: "Anti-Cheat Engine", desc: "Tab-switch detection, copy-paste tracking, and admin flagging." },
  { icon: BarChart3, title: "Admin Analytics", desc: "Real-time stats, cheating alerts, and member performance insights." },
];

const stats = [
  { label: "Active Hackers", value: "500+" },
  { label: "Problems Solved", value: "10K+" },
  { label: "Battles Won", value: "2K+" },
  { label: "Lines of Code", value: "1M+" },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden relative">
      {/* Scanline overlay */}
      <div className="fixed inset-0 pointer-events-none scanlines opacity-30 z-50" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-40 border-b border-border/50 backdrop-blur-xl bg-background/80">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/30 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold">
              <span className="text-primary">CodeClub</span>
              <span className="text-foreground"> Pro</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <button onClick={() => navigate("/dashboard")} className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all glow-border">
                Dashboard →
              </button>
            ) : (
              <>
                <button onClick={() => navigate("/login")} className="px-5 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                  $ login
                </button>
                <button onClick={() => navigate("/login")} className="px-5 py-2 rounded-md bg-primary text-primary-foreground text-sm font-bold hover:bg-primary/90 transition-all glow-border">
                  Get Access →
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute inset-0 matrix-bg" />
        {/* Floating code particles */}
        <div className="absolute top-20 left-10 text-primary/10 text-xs font-mono animate-float">{'{ code: true }'}</div>
        <div className="absolute top-40 right-20 text-primary/10 text-xs font-mono animate-float" style={{ animationDelay: '2s' }}>{'while(true) learn()'}</div>
        <div className="absolute bottom-20 left-1/3 text-primary/10 text-xs font-mono animate-float" style={{ animationDelay: '4s' }}>{'git push origin main'}</div>

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            <span className="font-mono">v2.0 — Advanced Competitive Platform</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in font-display">
            <span className="text-foreground">{'>'} </span>
            <span className="gradient-text-neon">hack.</span>
            <span className="text-foreground"> compete.</span>
            <br />
            <span className="text-primary">dominate.</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in font-mono">
            The terminal-native coding platform for college clubs.
            Challenges, battles, streaks, and leaderboards — all in one place.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <button onClick={() => navigate(user ? "/dashboard" : "/login")} className="px-8 py-4 rounded-md bg-primary text-primary-foreground font-bold text-lg flex items-center gap-2 hover:bg-primary/90 transition-all glow-border group font-mono">
              {user ? "$ go --dashboard" : "$ join --now"}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-4 rounded-md border border-primary/30 text-primary font-medium text-lg hover:bg-primary/5 transition-all font-mono">
              explore --features
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center terminal-card rounded-lg p-6">
              <p className="text-3xl font-bold text-primary animate-count-up">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1 font-mono">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 font-display">
              <span className="text-primary">{'>'}</span> System <span className="gradient-text">Features</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto font-mono">
              A complete hacker toolkit for your coding club.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div key={f.title} className="terminal-card rounded-lg p-6 group hover:border-primary/30 transition-all duration-300">
                <f.icon className="w-8 h-8 mb-4 text-primary group-hover:text-neon-cyan transition-colors" />
                <h3 className="text-md font-bold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto terminal-card rounded-lg p-8 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-neon-red/60" />
            <div className="w-3 h-3 rounded-full bg-neon-amber/60" />
            <div className="w-3 h-3 rounded-full bg-neon-green/60" />
            <span className="text-xs text-muted-foreground ml-2 font-mono">terminal — bash</span>
          </div>
          <div className="font-mono text-sm space-y-2">
            <p className="text-muted-foreground">$ whoami</p>
            <p className="text-primary">future_coder</p>
            <p className="text-muted-foreground">$ status</p>
            <p className="text-foreground">Ready to join the most elite coding club platform.</p>
            <p className="text-muted-foreground">$ action</p>
            <div className="flex items-center gap-4 mt-4">
              <button onClick={() => navigate(user ? "/dashboard" : "/login")} className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all glow-border">
                {user ? "$ go --dashboard" : "$ register --now"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-primary" />
            <span className="font-bold text-primary font-mono">CodeClub Pro</span>
          </div>
          <p className="text-sm text-muted-foreground font-mono">© 2026 CodeClub Pro // Built for hackers, by hackers.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
