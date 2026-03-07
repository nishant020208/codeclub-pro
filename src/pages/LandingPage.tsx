import React from "react";
import { useNavigate } from "react-router-dom";
import { Code2, Trophy, Users, BookOpen, Zap, Swords, ArrowRight, Star, Terminal, Rocket, Shield, BarChart3 } from "lucide-react";

const features = [
  { icon: Terminal, title: "Coding Challenges", desc: "Solve DSA problems across Easy, Medium, and Hard difficulties with AI-powered evaluation.", color: "text-[hsl(var(--neon-cyan))]" },
  { icon: Swords, title: "Contests & Hackathons", desc: "Compete in timed coding contests with live leaderboards and win XP rewards.", color: "text-[hsl(var(--neon-purple))]" },
  { icon: Trophy, title: "Gamified XP System", desc: "Earn XP, unlock badges, level up from Beginner to Legend, and climb the leaderboard.", color: "text-[hsl(var(--neon-pink))]" },
  { icon: Rocket, title: "Project Showcase", desc: "Upload projects with GitHub links, get likes & comments, and get featured by admins.", color: "text-[hsl(var(--neon-orange))]" },
  { icon: BookOpen, title: "Learning Paths", desc: "Structured courses with quizzes, resources for DSA, Web Dev, AI/ML, and more.", color: "text-[hsl(var(--neon-cyan))]" },
  { icon: BarChart3, title: "Analytics & Insights", desc: "Track your progress, view your rank, and see platform-wide activity stats.", color: "text-[hsl(var(--neon-purple))]" },
];

const stats = [
  { label: "Active Members", value: "500+", icon: Users },
  { label: "Problems Solved", value: "10K+", icon: Terminal },
  { label: "Contests Held", value: "50+", icon: Swords },
  { label: "Badges Awarded", value: "2K+", icon: Star },
];

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 border-b border-border/50 backdrop-blur-xl bg-background/60">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-primary" />
            </div>
            <span className="text-lg font-bold"><span className="gradient-text">CodeClub</span> Pro</span>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate("/login")} className="px-5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Sign In
            </button>
            <button onClick={() => navigate("/login")} className="px-5 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-all glow-border">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 mesh-gradient opacity-50" />
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-accent/5 blur-[120px]" />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8 animate-fade-in">
            <Zap className="w-4 h-4" />
            The Ultimate Coding Club Platform
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-in">
            Level Up Your
            <br />
            <span className="gradient-text-neon">Coding Journey</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-fade-in">
            Compete in contests, solve challenges, earn XP, unlock badges, showcase projects — all in one gamified platform built for coding clubs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
            <button onClick={() => navigate("/login")} className="px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg flex items-center gap-2 hover:opacity-90 transition-all glow-border group">
              Join CodeClub Pro
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => document.getElementById("features")?.scrollIntoView({ behavior: "smooth" })} className="px-8 py-4 rounded-xl border border-border text-foreground font-medium text-lg hover:bg-secondary/50 transition-all">
              Explore Features
            </button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 px-6 border-y border-border/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold gradient-text-neon">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Everything Your Club <span className="gradient-text">Needs</span></h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">From challenges to certificates — a complete platform to run a world-class coding club.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="neon-card rounded-2xl p-6 group hover:scale-[1.02] transition-all duration-300">
                <f.icon className={`w-10 h-10 mb-4 ${f.color}`} />
                <h3 className="text-lg font-semibold text-foreground mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center neon-card rounded-3xl p-12 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
          <div className="relative">
            <Shield className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-4">Ready to <span className="gradient-text-neon">Transform</span> Your Club?</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-lg mx-auto">
              Join hundreds of students already using CodeClub Pro to compete, learn, and grow together.
            </p>
            <button onClick={() => navigate("/login")} className="px-10 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-border">
              Get Started Now
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="font-semibold"><span className="gradient-text">CodeClub</span> Pro</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 CodeClub Pro. Built for coding clubs worldwide.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
