import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Code2, Play, Send, ChevronLeft, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface DSAQuestion {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  language: string;
  constraints: string | null;
  sample_input: string | null;
  sample_output: string | null;
}

const LANG_TEMPLATES: Record<string, string> = {
  Python: '# Write your solution here\ndef solve():\n    pass\n\nsolve()',
  JavaScript: '// Write your solution here\nfunction solve() {\n\n}\n\nsolve();',
  Java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}',
  "C++": '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
  Go: 'package main\n\nimport "fmt"\n\nfunc main() {\n    // Write your solution here\n    fmt.Println("Hello")\n}',
  Rust: 'fn main() {\n    // Write your solution here\n}',
};

const DSAPracticePage: React.FC = () => {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [selected, setSelected] = useState<DSAQuestion | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [output, setOutput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");

  useEffect(() => {
    supabase.from("dsa_questions").select("*").order("created_at").then(({ data }) => {
      setQuestions(data || []);
      setLoading(false);
    });
  }, []);

  const selectQuestion = (q: DSAQuestion) => {
    setSelected(q);
    setLanguage(q.language);
    setCode(LANG_TEMPLATES[q.language] || "");
    setOutput("");
  };

  const handleSubmit = async () => {
    if (!selected || !user || !code.trim()) return;
    setSubmitting(true);
    setOutput("Evaluating with AI...");

    try {
      const prompt = `Problem: ${selected.title}\nDescription: ${selected.description || "N/A"}\nConstraints: ${selected.constraints || "N/A"}\nSample Input: ${selected.sample_input || "N/A"}\nSample Output: ${selected.sample_output || "N/A"}\n\nLanguage: ${language}\nSubmitted Code:\n\`\`\`\n${code}\n\`\`\``;

      const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          mode: "evaluate_code",
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!resp.ok) throw new Error("Evaluation failed");
      const data = await resp.json();
      let result: any;
      try { result = JSON.parse(data.result); } catch { result = { score: 0, status: "error", feedback: data.result }; }

      // Save submission
      await supabase.from("dsa_submissions").insert({
        user_id: user.id,
        question_id: selected.id,
        code,
        language,
        score: result.score || 0,
        status: result.status || "error",
        feedback: result.feedback || "",
      });

      // Track activity
      await supabase.from("user_activity").insert({
        user_id: user.id,
        activity_type: "dsa_submission",
        metadata: { question_id: selected.id, score: result.score, status: result.status },
      });

      setOutput(`Score: ${result.score}/100 | Status: ${result.status}\n\n${result.feedback}`);
      toast.success(`Submission: ${result.status} (${result.score}/100)`);
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
      toast.error("Evaluation failed");
    }
    setSubmitting(false);
  };

  const diffColor = (d: string) =>
    d === "Easy" ? "text-accent" : d === "Medium" ? "text-yellow-400" : "text-destructive";

  const filtered = filter === "All" ? questions : questions.filter(q => q.difficulty === filter);

  if (selected) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
        {/* Header */}
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-secondary transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-xl font-bold text-foreground truncate">{selected.title}</h2>
            <span className={`text-xs font-medium ${diffColor(selected.difficulty)}`}>{selected.difficulty}</span>
          </div>
          <select value={language} onChange={e => { setLanguage(e.target.value); setCode(LANG_TEMPLATES[e.target.value] || ""); }}
            className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm">
            {Object.keys(LANG_TEMPLATES).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
          {/* Problem description */}
          <div className="glass-card rounded-xl p-5 overflow-y-auto scrollbar-thin space-y-4">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
              <p className="text-sm text-foreground whitespace-pre-wrap">{selected.description || "No description"}</p>
            </div>
            {selected.constraints && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Constraints</h3>
                <p className="text-sm text-foreground font-mono">{selected.constraints}</p>
              </div>
            )}
            {selected.sample_input && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Sample Input</h3>
                <pre className="text-sm text-foreground bg-secondary/50 rounded-lg p-3 font-mono">{selected.sample_input}</pre>
              </div>
            )}
            {selected.sample_output && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Sample Output</h3>
                <pre className="text-sm text-foreground bg-secondary/50 rounded-lg p-3 font-mono">{selected.sample_output}</pre>
              </div>
            )}
          </div>

          {/* Code editor + output */}
          <div className="flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <textarea value={code} onChange={e => setCode(e.target.value)}
                className="w-full h-full px-4 py-3 rounded-xl bg-secondary/50 border border-border text-foreground font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none scrollbar-thin"
                spellCheck={false} />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSubmit} disabled={submitting}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50">
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Evaluating..." : "Submit"}
              </button>
            </div>
            {output && (
              <div className="glass-card rounded-xl p-4 max-h-48 overflow-y-auto scrollbar-thin">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Output</h4>
                <pre className="text-sm text-foreground whitespace-pre-wrap font-mono">{output}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          <span className="gradient-text">DSA</span> Practice
        </h1>
        <p className="text-muted-foreground mt-1">Solve coding problems and level up</p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {["All", "Easy", "Medium", "Hard"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="shimmer h-20 rounded-xl" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-xl p-12 text-center">
          <Code2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No problems available yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(q => (
            <button key={q.id} onClick={() => selectQuestion(q)}
              className="w-full glass-card rounded-xl p-5 text-left hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{q.title}</h3>
                  {q.description && <p className="text-sm text-muted-foreground mt-1 truncate">{q.description}</p>}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs font-medium ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                  <span className="text-xs px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{q.language}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default DSAPracticePage;
