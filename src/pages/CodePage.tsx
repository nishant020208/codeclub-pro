import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Github, ExternalLink, X } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string | null;
  github_link: string | null;
  mvp_link: string | null;
  team_members: string[];
  created_at: string;
}

const CodePage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", github_link: "", mvp_link: "", team_members: "" });
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    const { data } = await supabase.from("projects").select("*").eq("user_id", user!.id).order("created_at", { ascending: false });
    setProjects(data || []);
    setLoading(false);
  };

  useEffect(() => { if (user) fetchProjects(); }, [user]);

  const handleAdd = async () => {
    if (!form.name) { toast.error("Project name required"); return; }
    const { error } = await supabase.from("projects").insert({
      user_id: user!.id,
      name: form.name,
      description: form.description || null,
      github_link: form.github_link || null,
      mvp_link: form.mvp_link || null,
      team_members: form.team_members ? form.team_members.split(",").map((s) => s.trim()) : [],
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Project added!");
    setForm({ name: "", description: "", github_link: "", mvp_link: "", team_members: "" });
    setShowForm(false);
    fetchProjects();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground mt-1">Showcase your coding work</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Project"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project Name" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
          <input value={form.github_link} onChange={(e) => setForm({ ...form, github_link: e.target.value })} placeholder="GitHub Link" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <input value={form.mvp_link} onChange={(e) => setForm({ ...form, mvp_link: e.target.value })} placeholder="Live/MVP Link" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <input value={form.team_members} onChange={(e) => setForm({ ...form, team_members: e.target.value })} placeholder="Team Members (comma separated)" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <button onClick={handleAdd} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">Add Project</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="shimmer h-40 rounded-xl" />)}
        </div>
      ) : projects.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No projects yet. Add your first one!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className="glass-card rounded-xl p-6 space-y-3">
              <h3 className="font-semibold text-foreground text-lg">{p.name}</h3>
              {p.description && <p className="text-sm text-muted-foreground">{p.description}</p>}
              <div className="flex flex-wrap gap-2">
                {p.github_link && (
                  <a href={p.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <Github className="w-3 h-3" /> GitHub
                  </a>
                )}
                {p.mvp_link && (
                  <a href={p.mvp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-primary hover:underline">
                    <ExternalLink className="w-3 h-3" /> Live
                  </a>
                )}
              </div>
              {p.team_members.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {p.team_members.map((m) => (
                    <span key={m} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">{m}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CodePage;
