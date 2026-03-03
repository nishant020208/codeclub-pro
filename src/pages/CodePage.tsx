import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Github, ExternalLink, X, Heart, MessageCircle, Star, Send } from "lucide-react";
import { toast } from "sonner";

interface Project {
  id: string;
  name: string;
  description: string | null;
  github_link: string | null;
  mvp_link: string | null;
  team_members: string[];
  tech_stack: string[];
  is_featured: boolean;
  likes_count: number;
  user_id: string;
  created_at: string;
}

interface Comment {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
}

const CodePage: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", github_link: "", mvp_link: "", team_members: "", tech_stack: "" });
  const [loading, setLoading] = useState(true);
  const [likedProjects, setLikedProjects] = useState<Set<string>>(new Set());
  const [commentsOpen, setCommentsOpen] = useState<string | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [viewMode, setViewMode] = useState<"mine" | "all">("all");

  const fetchProjects = async () => {
    const query = viewMode === "mine" && user
      ? supabase.from("projects").select("*").eq("user_id", user.id).order("created_at", { ascending: false })
      : supabase.from("projects").select("*").order("is_featured", { ascending: false }).order("likes_count", { ascending: false }).order("created_at", { ascending: false });
    const { data } = await query;
    setProjects((data as Project[]) || []);
    if (user) {
      const { data: likes } = await supabase.from("project_likes").select("project_id").eq("user_id", user.id);
      setLikedProjects(new Set((likes || []).map((l: any) => l.project_id)));
    }
    setLoading(false);
  };

  useEffect(() => { fetchProjects(); }, [user, viewMode]);

  const handleAdd = async () => {
    if (!form.name) { toast.error("Project name required"); return; }
    const { error } = await supabase.from("projects").insert({
      user_id: user!.id,
      name: form.name,
      description: form.description || null,
      github_link: form.github_link || null,
      mvp_link: form.mvp_link || null,
      team_members: form.team_members ? form.team_members.split(",").map((s) => s.trim()) : [],
      tech_stack: form.tech_stack ? form.tech_stack.split(",").map((s) => s.trim()) : [],
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Project added! 🚀");
    setForm({ name: "", description: "", github_link: "", mvp_link: "", team_members: "", tech_stack: "" });
    setShowForm(false);
    fetchProjects();
  };

  const toggleLike = async (projectId: string) => {
    if (!user) return;
    const isLiked = likedProjects.has(projectId);
    if (isLiked) {
      await supabase.from("project_likes").delete().eq("project_id", projectId).eq("user_id", user.id);
      await supabase.from("projects").update({ likes_count: Math.max(0, (projects.find(p => p.id === projectId)?.likes_count || 1) - 1) }).eq("id", projectId);
      setLikedProjects((prev) => { const s = new Set(prev); s.delete(projectId); return s; });
    } else {
      await supabase.from("project_likes").insert({ project_id: projectId, user_id: user.id });
      await supabase.from("projects").update({ likes_count: (projects.find(p => p.id === projectId)?.likes_count || 0) + 1 }).eq("id", projectId);
      setLikedProjects((prev) => new Set([...prev, projectId]));
    }
    fetchProjects();
  };

  const openComments = async (projectId: string) => {
    setCommentsOpen(projectId);
    const { data } = await supabase.from("project_comments").select("*").eq("project_id", projectId).order("created_at", { ascending: true });
    setComments((data as Comment[]) || []);
  };

  const addComment = async () => {
    if (!newComment.trim() || !commentsOpen || !user) return;
    const { error } = await supabase.from("project_comments").insert({ project_id: commentsOpen, user_id: user.id, content: newComment.trim() });
    if (error) { toast.error(error.message); return; }
    setNewComment("");
    openComments(commentsOpen);
  };

  const techColors = ["hsl(var(--neon-cyan))", "hsl(var(--neon-purple))", "hsl(var(--neon-pink))", "hsl(var(--neon-blue))", "hsl(var(--neon-green))"];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold">
            <span className="gradient-text-neon">Project</span> Showcase
          </h1>
          <p className="text-muted-foreground mt-1">Explore and share amazing projects</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-xl bg-secondary/50 p-0.5">
            {(["all", "mine"] as const).map((m) => (
              <button key={m} onClick={() => setViewMode(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${viewMode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{m === "all" ? "All Projects" : "My Projects"}</button>
            ))}
          </div>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all glow-button">
            {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            {showForm ? "Cancel" : "New"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="neon-card rounded-2xl p-6 space-y-4 animate-fade-in">
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Project Name" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.github_link} onChange={(e) => setForm({ ...form, github_link: e.target.value })} placeholder="GitHub Link" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
            <input value={form.mvp_link} onChange={(e) => setForm({ ...form, mvp_link: e.target.value })} placeholder="Live Demo Link" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          </div>
          <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} placeholder="Tech Stack (comma separated: React, Node.js, ...)" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <input value={form.team_members} onChange={(e) => setForm({ ...form, team_members: e.target.value })} placeholder="Team Members (comma separated)" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <button onClick={handleAdd} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-button">Add Project</button>
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{[1, 2, 3, 4].map((i) => <div key={i} className="shimmer h-48 rounded-2xl" />)}</div>
      ) : projects.length === 0 ? (
        <div className="neon-card rounded-2xl p-12 text-center">
          <Github className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">{viewMode === "mine" ? "You haven't added any projects yet." : "No projects yet. Be the first!"}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((p) => (
            <div key={p.id} className={`neon-card rounded-2xl p-6 space-y-3 ${p.is_featured ? "ring-1 ring-primary/30" : ""}`}>
              {p.is_featured && (
                <div className="flex items-center gap-1 text-xs font-medium" style={{ color: "hsl(var(--neon-orange))" }}>
                  <Star className="w-3 h-3" /> Featured Project
                </div>
              )}
              <h3 className="font-bold text-foreground text-lg">{p.name}</h3>
              {p.description && <p className="text-sm text-muted-foreground line-clamp-2">{p.description}</p>}

              {p.tech_stack && p.tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {p.tech_stack.map((t, i) => (
                    <span key={t} className="text-xs px-2 py-0.5 rounded-md" style={{ background: `${techColors[i % techColors.length]}10`, color: techColors[i % techColors.length], border: `1px solid ${techColors[i % techColors.length]}20` }}>{t}</span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-3 pt-2 border-t border-border">
                {p.github_link && (
                  <a href={p.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Github className="w-3.5 h-3.5" /> Code
                  </a>
                )}
                {p.mvp_link && (
                  <a href={p.mvp_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="w-3.5 h-3.5" /> Demo
                  </a>
                )}
                <div className="flex-1" />
                <button onClick={() => toggleLike(p.id)} className="flex items-center gap-1 text-xs transition-colors hover:scale-110 active:scale-95" style={{ color: likedProjects.has(p.id) ? "hsl(var(--neon-pink))" : undefined }}>
                  <Heart className={`w-4 h-4 ${likedProjects.has(p.id) ? "fill-current" : ""}`} />
                  {p.likes_count || 0}
                </button>
                <button onClick={() => openComments(p.id)} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                  <MessageCircle className="w-4 h-4" /> Chat
                </button>
              </div>

              {commentsOpen === p.id && (
                <div className="border-t border-border pt-3 space-y-2 animate-fade-in">
                  {comments.map((c) => (
                    <div key={c.id} className="text-xs bg-secondary/50 rounded-lg p-2">
                      <span className="text-muted-foreground">{new Date(c.created_at).toLocaleDateString()}</span>
                      <p className="text-foreground mt-0.5">{c.content}</p>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input value={newComment} onChange={(e) => setNewComment(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addComment()} placeholder="Write a comment..." className="flex-1 px-3 py-2 rounded-lg bg-secondary/50 border border-border text-foreground text-xs placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
                    <button onClick={addComment} className="p-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all">
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
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
