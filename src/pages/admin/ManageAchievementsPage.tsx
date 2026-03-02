import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X, Save, Trophy, Sparkles, Loader2 } from "lucide-react";

interface Achievement {
  id: string;
  title: string;
  description: string | null;
  rule_text: string | null;
  parsed_rule: any;
}

const ManageAchievementsPage: React.FC = () => {
  const [items, setItems] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", rule_text: "" });
  const [parsing, setParsing] = useState(false);

  const fetchItems = async () => {
    const { data } = await supabase.from("achievements").select("*").order("created_at", { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchItems(); }, []);

  const parseRule = async (ruleText: string): Promise<any> => {
    setParsing(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          mode: "evaluate_code",
          messages: [{
            role: "user",
            content: `Parse this achievement rule into a JSON tracking object. Rule: "${ruleText}"\n\nReturn JSON: {"metric": "quiz_count"|"dsa_count"|"login_streak"|"project_count"|"course_completed", "threshold": <number>, "operator": ">="}`,
          }],
        }),
      });
      const data = await resp.json();
      try { return JSON.parse(data.result); } catch { return {}; }
    } catch { return {}; }
    finally { setParsing(false); }
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    let parsedRule = {};
    if (form.rule_text) parsedRule = await parseRule(form.rule_text);

    const payload = { title: form.title, description: form.description || null, rule_text: form.rule_text || null, parsed_rule: parsedRule };

    if (editId) {
      const { error } = await supabase.from("achievements").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); return; }
      toast.success("Updated!");
    } else {
      const { error } = await supabase.from("achievements").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Created!");
    }
    setForm({ title: "", description: "", rule_text: "" });
    setEditId(null);
    setShowForm(false);
    fetchItems();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("achievements").delete().eq("id", id);
    toast.success("Deleted");
    fetchItems();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Achievements</h1>
          <p className="text-muted-foreground mt-1">Define achievements with AI rules</p>
        </div>
        <button onClick={() => { setForm({ title: "", description: "", rule_text: "" }); setEditId(null); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Create"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Achievement Title"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          <div className="relative">
            <Sparkles className="absolute left-3 top-3.5 w-4 h-4 text-primary" />
            <input value={form.rule_text} onChange={e => setForm({ ...form, rule_text: e.target.value })}
              placeholder='AI Rule (e.g., "Complete 10 courses", "Submit 100 DSA problems")'
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 border border-primary/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <button onClick={handleSave} disabled={parsing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50">
            {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {parsing ? "Parsing..." : editId ? "Update" : "Create"}
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
      ) : items.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Trophy className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No achievements yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {items.map(a => (
            <div key={a.id} className="glass-card rounded-xl p-5 group">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-primary" />
                  <div>
                    <h3 className="font-semibold text-foreground">{a.title}</h3>
                    {a.description && <p className="text-xs text-muted-foreground">{a.description}</p>}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setForm({ title: a.title, description: a.description || "", rule_text: a.rule_text || "" }); setEditId(a.id); setShowForm(true); }}
                    className="p-1.5 rounded-lg hover:bg-secondary"><Edit className="w-3.5 h-3.5 text-muted-foreground" /></button>
                  <button onClick={() => handleDelete(a.id)} className="p-1.5 rounded-lg hover:bg-destructive/10"><Trash2 className="w-3.5 h-3.5 text-destructive" /></button>
                </div>
              </div>
              {a.rule_text && (
                <div className="mt-3 flex items-center gap-2">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span className="text-xs text-primary">{a.rule_text}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageAchievementsPage;
