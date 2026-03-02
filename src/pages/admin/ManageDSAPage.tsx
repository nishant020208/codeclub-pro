import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, Edit, X, Save } from "lucide-react";

interface DSAQuestion {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  language: string;
  constraints: string | null;
  sample_input: string | null;
  sample_output: string | null;
  test_cases: any;
}

const DIFFICULTIES = ["Easy", "Medium", "Hard"];
const LANGUAGES = ["Python", "JavaScript", "Java", "C++", "Go", "Rust"];

const ManageDSAPage: React.FC = () => {
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", description: "", difficulty: "Easy", language: "Python",
    constraints: "", sample_input: "", sample_output: "", test_cases: "[]",
  });

  const fetchQuestions = async () => {
    const { data } = await supabase.from("dsa_questions").select("*").order("created_at", { ascending: false });
    setQuestions(data || []);
    setLoading(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const resetForm = () => {
    setForm({ title: "", description: "", difficulty: "Easy", language: "Python", constraints: "", sample_input: "", sample_output: "", test_cases: "[]" });
    setEditId(null);
    setShowForm(false);
  };

  const handleSave = async () => {
    if (!form.title) { toast.error("Title is required"); return; }
    let parsedTests: any[];
    try { parsedTests = JSON.parse(form.test_cases); } catch { toast.error("Invalid test cases JSON"); return; }

    const payload = {
      title: form.title,
      description: form.description || null,
      difficulty: form.difficulty,
      language: form.language,
      constraints: form.constraints || null,
      sample_input: form.sample_input || null,
      sample_output: form.sample_output || null,
      test_cases: parsedTests,
    };

    if (editId) {
      const { error } = await supabase.from("dsa_questions").update(payload).eq("id", editId);
      if (error) { toast.error(error.message); return; }
      toast.success("Question updated!");
    } else {
      const { error } = await supabase.from("dsa_questions").insert(payload);
      if (error) { toast.error(error.message); return; }
      toast.success("Question added!");
    }
    resetForm();
    fetchQuestions();
  };

  const handleEdit = (q: DSAQuestion) => {
    setForm({
      title: q.title, description: q.description || "", difficulty: q.difficulty,
      language: q.language, constraints: q.constraints || "",
      sample_input: q.sample_input || "", sample_output: q.sample_output || "",
      test_cases: JSON.stringify(q.test_cases, null, 2),
    });
    setEditId(q.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("dsa_questions").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Deleted!");
    fetchQuestions();
  };

  const diffColor = (d: string) =>
    d === "Easy" ? "text-accent" : d === "Medium" ? "text-yellow-400" : "text-destructive";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">DSA Questions</h1>
          <p className="text-muted-foreground mt-1">Manage coding problems</p>
        </div>
        <button onClick={() => { resetForm(); setShowForm(!showForm); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Question"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Problem Title"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Problem Description" rows={4}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none" />
          <div className="grid grid-cols-2 gap-4">
            <select value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}
              className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              {DIFFICULTIES.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <select value={form.language} onChange={e => setForm({ ...form, language: e.target.value })}
              className="px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <input value={form.constraints} onChange={e => setForm({ ...form, constraints: e.target.value })} placeholder="Constraints (e.g., 1 <= n <= 10^5)"
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          <div className="grid grid-cols-2 gap-4">
            <textarea value={form.sample_input} onChange={e => setForm({ ...form, sample_input: e.target.value })} placeholder="Sample Input" rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm" />
            <textarea value={form.sample_output} onChange={e => setForm({ ...form, sample_output: e.target.value })} placeholder="Sample Output" rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm" />
          </div>
          <textarea value={form.test_cases} onChange={e => setForm({ ...form, test_cases: e.target.value })}
            placeholder='Test Cases JSON: [{"input": "...", "expected": "..."}]' rows={4}
            className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-mono text-sm" />
          <button onClick={handleSave}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">
            <Save className="w-4 h-4" /> {editId ? "Update" : "Create"} Question
          </button>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
      ) : questions.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <p className="text-muted-foreground">No DSA questions yet. Add your first one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {questions.map(q => (
            <div key={q.id} className="glass-card rounded-xl p-5 flex items-center justify-between group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground truncate">{q.title}</h3>
                  <span className={`text-xs font-medium ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{q.language}</span>
                </div>
                {q.description && <p className="text-sm text-muted-foreground mt-1 truncate">{q.description}</p>}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(q)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
                  <Edit className="w-4 h-4 text-muted-foreground" />
                </button>
                <button onClick={() => handleDelete(q.id)} className="p-2 rounded-lg hover:bg-destructive/10 transition-colors">
                  <Trash2 className="w-4 h-4 text-destructive" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageDSAPage;
