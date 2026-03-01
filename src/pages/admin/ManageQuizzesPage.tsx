import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Plus, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

interface Course { id: string; title: string; }
interface Quiz { id: string; course_id: string; question: string; options: string[]; correct_answer: number; }

const ManageQuizzesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ question: "", options: ["", "", "", ""], correct_answer: 0 });

  useEffect(() => {
    supabase.from("courses").select("id, title").order("sort_order").then(({ data }) => setCourses(data || []));
  }, []);

  useEffect(() => {
    if (!selectedCourse) { setQuizzes([]); return; }
    supabase.from("quizzes").select("*").eq("course_id", selectedCourse).order("sort_order").then(({ data }) => {
      setQuizzes((data || []).map((q: any) => ({ ...q, options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || "[]") })));
    });
  }, [selectedCourse]);

  const handleAdd = async () => {
    if (!form.question || !selectedCourse) { toast.error("Fill all fields"); return; }
    const { error } = await supabase.from("quizzes").insert({
      course_id: selectedCourse,
      question: form.question,
      options: form.options,
      correct_answer: form.correct_answer,
      sort_order: quizzes.length,
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Quiz added!");
    setForm({ question: "", options: ["", "", "", ""], correct_answer: 0 });
    setShowForm(false);
    // Refresh
    const { data } = await supabase.from("quizzes").select("*").eq("course_id", selectedCourse).order("sort_order");
    setQuizzes((data || []).map((q: any) => ({ ...q, options: Array.isArray(q.options) ? q.options : JSON.parse(q.options || "[]") })));
  };

  const handleDelete = async (id: string) => {
    await supabase.from("quizzes").delete().eq("id", id);
    toast.success("Quiz deleted");
    setQuizzes(quizzes.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-foreground">Manage Quizzes</h1>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Select Course</label>
        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        >
          <option value="">Choose a course...</option>
          {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
        </select>
      </div>

      {selectedCourse && (
        <>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
            <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Quiz"}
          </button>

          {showForm && (
            <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
              <input value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Question" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
              {form.options.map((opt, i) => (
                <div key={i} className="flex gap-2 items-center">
                  <input
                    type="radio"
                    name="correct"
                    checked={form.correct_answer === i}
                    onChange={() => setForm({ ...form, correct_answer: i })}
                    className="accent-primary"
                  />
                  <input
                    value={opt}
                    onChange={(e) => {
                      const opts = [...form.options];
                      opts[i] = e.target.value;
                      setForm({ ...form, options: opts });
                    }}
                    placeholder={`Option ${i + 1}`}
                    className="flex-1 px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              ))}
              <p className="text-xs text-muted-foreground">Select the radio button for the correct answer</p>
              <button onClick={handleAdd} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">Add Quiz</button>
            </div>
          )}

          <div className="space-y-3">
            {quizzes.map((q, idx) => (
              <div key={q.id} className="glass-card rounded-xl p-5 flex items-start justify-between">
                <div>
                  <p className="font-medium text-foreground">{idx + 1}. {q.question}</p>
                  <div className="mt-2 space-y-1">
                    {q.options.map((o, oi) => (
                      <p key={oi} className={`text-sm ${oi === q.correct_answer ? "text-accent font-medium" : "text-muted-foreground"}`}>
                        {oi === q.correct_answer ? "✓ " : "  "}{o}
                      </p>
                    ))}
                  </div>
                </div>
                <button onClick={() => handleDelete(q.id)} className="px-3 py-1.5 rounded-lg text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors shrink-0">
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageQuizzesPage;
