import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit2, Calendar } from "lucide-react";

const empty = { title: "", description: "", speaker: "", event_date: "", location: "", meeting_link: "", max_participants: 50, status: "upcoming" };

const ManageEventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [form, setForm] = useState<any>(empty);
  const [editing, setEditing] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { load(); }, []);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    setEvents(data || []);
  };

  const save = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    if (editing) {
      await supabase.from("events").update(form).eq("id", editing);
      toast.success("Updated");
    } else {
      await supabase.from("events").insert(form);
      toast.success("Created");
    }
    setForm(empty); setEditing(null); setShowForm(false); load();
  };

  const del = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast.success("Deleted"); load();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold"><span className="gradient-text-neon">Manage</span> Events</h1>
          <p className="text-muted-foreground mt-1">Create and manage events & workshops</p>
        </div>
        <button onClick={() => { setForm(empty); setEditing(null); setShowForm(true); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> New Event
        </button>
      </div>

      {showForm && (
        <div className="neon-card rounded-2xl p-6 space-y-4 animate-fade-in">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event Title" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={3} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input value={form.speaker} onChange={(e) => setForm({ ...form, speaker: e.target.value })} placeholder="Speaker Name" className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input type="datetime-local" value={form.event_date} onChange={(e) => setForm({ ...form, event_date: e.target.value })} className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Location" className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input value={form.meeting_link} onChange={(e) => setForm({ ...form, meeting_link: e.target.value })} placeholder="Meeting Link (optional)" className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <input type="number" value={form.max_participants} onChange={(e) => setForm({ ...form, max_participants: parseInt(e.target.value) || 50 })} placeholder="Max Participants" className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-3">
            <button onClick={save} className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">{editing ? "Update" : "Create"}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="px-6 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-foreground">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {events.map((ev) => (
          <div key={ev.id} className="neon-card rounded-xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{ev.title}</p>
                <p className="text-xs text-muted-foreground">{ev.event_date ? new Date(ev.event_date).toLocaleDateString() : "No date"} · {ev.speaker || "TBA"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => { setForm(ev); setEditing(ev.id); setShowForm(true); }} className="p-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-foreground"><Edit2 className="w-4 h-4" /></button>
              <button onClick={() => del(ev.id)} className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageEventsPage;
