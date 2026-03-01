import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";

interface Course {
  id: string;
  title: string;
  description: string | null;
  theory_content: string | null;
}

const ManageCoursesPage: React.FC = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", description: "", theory_content: "" });

  const fetchCourses = async () => {
    const { data } = await supabase.from("courses").select("*").order("sort_order");
    setCourses(data || []);
  };

  useEffect(() => { fetchCourses(); }, []);

  const handleSave = async () => {
    if (!form.title) { toast.error("Title required"); return; }
    if (editId) {
      const { error } = await supabase.from("courses").update({
        title: form.title,
        description: form.description || null,
        theory_content: form.theory_content || null,
      }).eq("id", editId);
      if (error) { toast.error(error.message); return; }
      toast.success("Course updated!");
    } else {
      const { error } = await supabase.from("courses").insert({
        title: form.title,
        description: form.description || null,
        theory_content: form.theory_content || null,
        sort_order: courses.length,
      });
      if (error) { toast.error(error.message); return; }
      toast.success("Course added!");
    }
    setForm({ title: "", description: "", theory_content: "" });
    setShowForm(false);
    setEditId(null);
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from("courses").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Course deleted"); fetchCourses(); }
  };

  const startEdit = (c: Course) => {
    setEditId(c.id);
    setForm({ title: c.title, description: c.description || "", theory_content: c.theory_content || "" });
    setShowForm(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-foreground">Manage Courses</h1>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: "", description: "", theory_content: "" }); }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-all">
          <Plus className="w-4 h-4" /> {showForm ? "Cancel" : "Add Course"}
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 space-y-4 animate-fade-in">
          <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Course Title" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Short Description" className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
          <textarea value={form.theory_content} onChange={(e) => setForm({ ...form, theory_content: e.target.value })} placeholder="Theory Content (HTML allowed)" rows={8} className="w-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none font-mono text-sm" />
          <button onClick={handleSave} className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all">
            {editId ? "Update" : "Add"} Course
          </button>
        </div>
      )}

      <div className="space-y-3">
        {courses.map((c) => (
          <div key={c.id} className="glass-card rounded-xl p-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-5 h-5 text-primary" />
              <div>
                <p className="font-medium text-foreground">{c.title}</p>
                <p className="text-sm text-muted-foreground">{c.description}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => startEdit(c)} className="px-3 py-1.5 rounded-lg text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">Edit</button>
              <button onClick={() => handleDelete(c.id)} className="px-3 py-1.5 rounded-lg text-xs bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCoursesPage;
