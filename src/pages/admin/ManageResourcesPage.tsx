import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, BookOpen } from "lucide-react";

const empty = { title: "", description: "", category: "dsa", resource_type: "link", url: "" };

const ManageResourcesPage: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };

  const save = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    if (editing) {
      await supabase.from("resources").update(form).eq("id", editing);
      toast.success("Updated");
    } else {
      await supabase.from("resources").insert(form);
      toast.success("Created");
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: string) => {
    await supabase.from("resources").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold"><span className="gradient-text-neon">Manage</span> Resources</h1>
          <p className="text-muted-foreground mt-1">Upload and organize learning resources</p>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">
          <Plus className="w-4 h-4" /> Add Resource
        </button>
      </div>

      {showForm && (
        <div className="neon-card rounded-2xl p-6 space-y-4 animate-fade-in">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Resource Title" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description (optional)" rows={2} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="dsa">DSA</option>
              <option value="webdev">Web Development</option>
              <option value="aiml">AI / ML</option>
              <option value="interview">Interview Prep</option>
            </select>
            <select value={form.resource_type} onChange={(e) => setForm({ ...form, resource_type: e.target.value })} className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="link">Link</option>
              <option value="pdf">PDF</option>
              <option value="github">GitHub Repo</option>
            </select>
            <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="URL" className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">{editing ? "Update" : "Add"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.id} className="neon-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{item.title}</p>
                <p className="text-xs text-muted-foreground">{item.category} · {item.resource_type}</p>
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

export default ManageResourcesPage;
