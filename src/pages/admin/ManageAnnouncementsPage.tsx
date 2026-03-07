import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Megaphone, Pin } from "lucide-react";

const empty = { title: "", content: "", category: "general", is_pinned: false };

const ManageAnnouncementsPage: React.FC = () => {
  const { user } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };

  const save = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    if (editing) {
      const { created_by, ...rest } = form;
      await supabase.from("announcements").update(rest).eq("id", editing);
      toast.success("Updated");
    } else {
      await supabase.from("announcements").insert({ ...form, created_by: user!.id });
      toast.success("Posted");
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold"><span className="gradient-text-neon">Manage</span> Announcements</h1>
          <p className="text-muted-foreground mt-1">Post and manage club announcements</p>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> New Post
        </button>
      </div>

      {showForm && (
        <div className="neon-card rounded-2xl p-6 space-y-4 animate-fade-in">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Announcement Title" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} placeholder="Content..." rows={4} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <div className="flex flex-wrap gap-4 items-center">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="general">General</option>
              <option value="hackathon">Hackathon</option>
              <option value="internship">Internship</option>
              <option value="event">Event</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
              <input type="checkbox" checked={form.is_pinned} onChange={(e) => setForm({ ...form, is_pinned: e.target.checked })} className="rounded border-border" />
              <Pin className="w-4 h-4" /> Pin this
            </label>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">{editing ? "Update" : "Post"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="neon-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Megaphone className="w-5 h-5 text-primary" />
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{item.title}</p>
                  {item.is_pinned && <Pin className="w-3 h-3 text-primary" />}
                </div>
                <p className="text-xs text-muted-foreground">{item.category} · {new Date(item.created_at).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setForm(item); setEditing(item.id); setShowForm(true); }} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => del(item.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageAnnouncementsPage;
