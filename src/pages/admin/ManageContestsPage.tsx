import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, Edit, Trophy, X } from "lucide-react";
import { toast } from "sonner";

interface Competition {
  id: string;
  title: string;
  description: string | null;
  deadline: string | null;
  start_time: string | null;
  rules: string | null;
  xp_reward: number | null;
  status: string | null;
  created_at: string;
}

const ManageContestsPage: React.FC = () => {
  const [comps, setComps] = useState<Competition[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Competition | null>(null);
  const [form, setForm] = useState({ title: "", description: "", rules: "", xp_reward: "100", start_time: "", deadline: "", status: "upcoming" });

  const fetchComps = async () => {
    const { data } = await supabase.from("competitions").select("*").order("created_at", { ascending: false });
    setComps((data as Competition[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchComps(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", rules: "", xp_reward: "100", start_time: "", deadline: "", status: "upcoming" });
    setEditing(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    const payload = {
      title: form.title,
      description: form.description || null,
      rules: form.rules || null,
      xp_reward: parseInt(form.xp_reward) || 100,
      start_time: form.start_time || null,
      deadline: form.deadline || null,
      status: form.status,
    };
    if (editing) {
      const { error } = await supabase.from("competitions").update(payload).eq("id", editing.id);
      if (error) { toast.error(error.message); return; }
      toast.success("Contest updated!");
    } else {
      const { error } = await supabase.from("competitions").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Contest created! 🏆");
    }
    resetForm();
    fetchComps();
  };

  const handleEdit = (c: Competition) => {
    setEditing(c);
    setForm({
      title: c.title,
      description: c.description || "",
      rules: c.rules || "",
      xp_reward: String(c.xp_reward || 100),
      start_time: c.start_time ? c.start_time.slice(0, 16) : "",
      deadline: c.deadline ? c.deadline.slice(0, 16) : "",
      status: c.status || "upcoming",
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this contest?")) return;
    await supabase.from("competitions").delete().eq("id", id);
    toast.success("Deleted");
    fetchComps();
  };

  const statusColors: Record<string, string> = {
    upcoming: "hsl(var(--neon-blue))",
    active: "hsl(var(--neon-green))",
    ended: "hsl(var(--muted-foreground))",
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold"><span className="gradient-text-neon">Manage</span> Contests</h1>
          <p className="text-muted-foreground mt-1">Create and manage hackathons & contests</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium glow-button">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "New Contest"}
        </button>
      </div>

      {showForm && (
        <div className="neon-card rounded-2xl p-6 space-y-4 animate-fade-in">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Contest Title" className={inputClass} />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className={inputClass + " resize-none"} />
          <textarea value={form.rules} onChange={(e) => setForm({ ...form, rules: e.target.value })} placeholder="Rules & guidelines" rows={2} className={inputClass + " resize-none"} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">XP Reward</label>
              <input type="number" value={form.xp_reward} onChange={(e) => setForm({ ...form, xp_reward: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Start Time</label>
              <input type="datetime-local" value={form.start_time} onChange={(e) => setForm({ ...form, start_time: e.target.value })} className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-muted-foreground mb-1 block">Deadline</label>
              <input type="datetime-local" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className={inputClass}>
              <option value="upcoming">Upcoming</option>
              <option value="active">Active</option>
              <option value="ended">Ended</option>
            </select>
          </div>
          <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold glow-button">{editing ? "Update" : "Create"} Contest</button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map((i) => <div key={i} className="shimmer h-24 rounded-xl" />)}</div>
      ) : comps.length === 0 ? (
        <div className="neon-card rounded-2xl p-12 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No contests yet</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comps.map((c) => (
            <div key={c.id} className="neon-card rounded-xl p-5 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-foreground truncate">{c.title}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full capitalize shrink-0" style={{ background: `${statusColors[c.status || "upcoming"]}15`, color: statusColors[c.status || "upcoming"] }}>{c.status}</span>
                  <span className="text-xs text-primary shrink-0">{c.xp_reward} XP</span>
                </div>
                {c.description && <p className="text-xs text-muted-foreground truncate">{c.description}</p>}
              </div>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => handleEdit(c)} className="p-2 rounded-lg hover:bg-secondary transition-colors"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                <button onClick={() => handleDelete(c.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors"><Trash2 className="w-4 h-4 text-destructive" /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageContestsPage;
