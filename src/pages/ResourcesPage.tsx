import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BookOpen, ExternalLink, FileText, Github, Search } from "lucide-react";

const categoryLabels: Record<string, { label: string; color: string }> = {
  dsa: { label: "DSA", color: "bg-[hsl(var(--neon-cyan))]/10 text-[hsl(var(--neon-cyan))]" },
  webdev: { label: "Web Development", color: "bg-[hsl(var(--neon-purple))]/10 text-[hsl(var(--neon-purple))]" },
  aiml: { label: "AI / ML", color: "bg-[hsl(var(--neon-pink))]/10 text-[hsl(var(--neon-pink))]" },
  interview: { label: "Interview Prep", color: "bg-[hsl(var(--neon-orange))]/10 text-[hsl(var(--neon-orange))]" },
};

const typeIcons: Record<string, React.ElementType> = { pdf: FileText, link: ExternalLink, github: Github };

const ResourcesPage: React.FC = () => {
  const [resources, setResources] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("resources").select("*").order("created_at", { ascending: false }).then(({ data }) => {
      setResources(data || []);
      setLoading(false);
    });
  }, []);

  const filtered = resources.filter((r) => {
    if (filter !== "all" && r.category !== filter) return false;
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold"><span className="gradient-text-neon">Resource</span> Library</h1>
        <p className="text-muted-foreground mt-1">Curated learning resources for every skill level</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search resources..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {["all", "dsa", "webdev", "aiml", "interview"].map((cat) => (
            <button key={cat} onClick={() => setFilter(cat)} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${filter === cat ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground hover:text-foreground border border-border"}`}>
              {cat === "all" ? "All" : categoryLabels[cat]?.label || cat}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="neon-card rounded-2xl p-12 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No resources found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((r) => {
            const Icon = typeIcons[r.resource_type] || ExternalLink;
            const catInfo = categoryLabels[r.category] || categoryLabels.dsa;
            return (
              <a key={r.id} href={r.url || "#"} target="_blank" rel="noreferrer" className="neon-card rounded-2xl p-5 group hover:scale-[1.02] transition-all duration-300 block">
                <div className="flex items-start justify-between mb-3">
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${catInfo.color}`}>{catInfo.label}</span>
                  <Icon className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">{r.title}</h3>
                {r.description && <p className="text-sm text-muted-foreground line-clamp-2">{r.description}</p>}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ResourcesPage;
