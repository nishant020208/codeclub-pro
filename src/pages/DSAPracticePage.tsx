import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Code2, Send, ChevronLeft, CheckCircle, XCircle, Loader2, Building2 } from "lucide-react";
import { useBadgeCheck } from "@/hooks/useBadgeCheck";

interface DSAQuestion {
  id: string;
  title: string;
  description: string | null;
  difficulty: string;
  language: string;
  constraints: string | null;
  sample_input: string | null;
  sample_output: string | null;
  company_tags?: string[];
}

const LANG_TEMPLATES: Record<string, string> = {
  Python: '# Write your solution here\ndef solve():\n    pass\n\nsolve()',
  JavaScript: '// Write your solution here\nfunction solve() {\n\n}\n\nsolve();',
  Java: 'public class Solution {\n    public static void main(String[] args) {\n        // Write your solution here\n    }\n}',
  "C++": '#include <iostream>\nusing namespace std;\n\nint main() {\n    // Write your solution here\n    return 0;\n}',
};

const COMPANIES = ["All", "Amazon", "Google", "Microsoft", "Meta", "Apple", "Netflix", "Adobe", "Flipkart", "Uber"];

const DSAPracticePage: React.FC = () => {
  const { user } = useAuth();
  const { checkBadges } = useBadgeCheck();
  const [questions, setQuestions] = useState<DSAQuestion[]>([]);
  const [selected, setSelected] = useState<DSAQuestion | null>(null);
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("Python");
  const [output, setOutput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("All");
  const [companyFilter, setCompanyFilter] = useState<string>("All");

  useEffect(() => {
    supabase.from("dsa_questions").select("*").order("created_at").then(({ data }) => {
      setQuestions((data || []).map((q: any) => ({ ...q, company_tags: q.company_tags || [] })));
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
        body: JSON.stringify({ mode: "evaluate_code", messages: [{ role: "user", content: prompt }] }),
      });

      if (!resp.ok) throw new Error("Evaluation failed");
      const data = await resp.json();
      let result: any;
      try { result = JSON.parse(data.result); } catch { result = { score: 0, status: "error", feedback: data.result }; }

      await supabase.from("dsa_submissions").insert({
        user_id: user.id, question_id: selected.id, code, language,
        score: result.score || 0, status: result.status || "error", feedback: result.feedback || "",
      });

      await supabase.from("user_activity").insert({
        user_id: user.id, activity_type: "dsa_submission",
        metadata: { question_id: selected.id, score: result.score, status: result.status },
      });

      setOutput(`Score: ${result.score}/100 | Status: ${result.status}\n\n${result.feedback}`);
      toast.success(`Submission: ${result.status} (${result.score}/100)`);

      // Check badges after submission
      setTimeout(() => checkBadges(), 1500);
    } catch (e: any) {
      setOutput(`Error: ${e.message}`);
      toast.error("Evaluation failed");
    }
    setSubmitting(false);
  };

  const diffColor = (d: string) =>
    d === "Easy" ? "text-primary" : d === "Medium" ? "text-neon-amber" : "text-destructive";

  const filtered = questions
    .filter(q => filter === "All" || q.difficulty === filter)
    .filter(q => companyFilter === "All" || (q.company_tags || []).includes(companyFilter));

  if (selected) {
    return (
      <div className="flex flex-col h-[calc(100vh-6rem)] animate-fade-in">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={() => setSelected(null)} className="p-2 rounded-md hover:bg-muted transition-colors">
            <ChevronLeft className="w-5 h-5 text-foreground" />
          </button>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate font-mono">{selected.title}</h2>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono font-bold ${diffColor(selected.difficulty)}`}>{selected.difficulty}</span>
              {(selected.company_tags || []).map(c => (
                <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan font-mono">{c}</span>
              ))}
            </div>
          </div>
          <select value={language} onChange={e => { setLanguage(e.target.value); setCode(LANG_TEMPLATES[e.target.value] || ""); }}
            className="px-3 py-2 rounded-md bg-muted border border-border text-foreground text-xs font-mono">
            {Object.keys(LANG_TEMPLATES).map(l => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 min-h-0">
          <div className="terminal-card rounded-lg p-5 overflow-y-auto scrollbar-thin space-y-4">
            <div>
              <h3 className="text-xs font-mono font-bold text-primary mb-2">DESCRIPTION</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{selected.description || "No description"}</p>
            </div>
            {selected.constraints && (
              <div>
                <h3 className="text-xs font-mono font-bold text-neon-amber mb-1">CONSTRAINTS</h3>
                <p className="text-sm text-foreground font-mono">{selected.constraints}</p>
              </div>
            )}
            {selected.sample_input && (
              <div>
                <h3 className="text-xs font-mono font-bold text-neon-cyan mb-1">SAMPLE INPUT</h3>
                <pre className="text-sm text-foreground bg-muted/50 rounded-md p-3 font-mono">{selected.sample_input}</pre>
              </div>
            )}
            {selected.sample_output && (
              <div>
                <h3 className="text-xs font-mono font-bold text-neon-cyan mb-1">SAMPLE OUTPUT</h3>
                <pre className="text-sm text-foreground bg-muted/50 rounded-md p-3 font-mono">{selected.sample_output}</pre>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <textarea value={code} onChange={e => setCode(e.target.value)}
                className="w-full h-full px-4 py-3 rounded-lg bg-muted/30 border border-border text-foreground font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none scrollbar-thin"
                spellCheck={false} />
            </div>
            <button onClick={handleSubmit} disabled={submitting}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 glow-border font-mono">
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              {submitting ? "evaluating..." : "$ submit"}
            </button>
            {output && (
              <div className="terminal-card rounded-lg p-4 max-h-48 overflow-y-auto scrollbar-thin">
                <h4 className="text-[10px] font-mono font-bold text-primary mb-2">OUTPUT</h4>
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
        <p className="text-sm text-muted-foreground font-mono mb-1">$ ls ./challenges</p>
        <h1 className="text-2xl font-bold text-foreground">
          <span className="text-primary">DSA</span> Practice
        </h1>
      </div>

      {/* Difficulty filters */}
      <div className="flex flex-wrap gap-2">
        {["All", "Easy", "Medium", "Hard"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-md text-xs font-mono font-bold transition-all ${
              filter === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}>
            {f}
          </button>
        ))}
        <div className="w-px bg-border mx-1" />
        {/* Company filters */}
        <div className="flex flex-wrap gap-1">
          {COMPANIES.map(c => (
            <button key={c} onClick={() => setCompanyFilter(c)}
              className={`px-3 py-1.5 rounded-md text-xs font-mono transition-all flex items-center gap-1 ${
                companyFilter === c ? "bg-neon-cyan/20 text-neon-cyan border border-neon-cyan/30" : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
              }`}>
              {c !== "All" && <Building2 className="w-3 h-3" />}
              {c}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="shimmer h-20 rounded-lg" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="terminal-card rounded-lg p-12 text-center">
          <Code2 className="w-10 h-10 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground font-mono text-sm">No problems found.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(q => (
            <button key={q.id} onClick={() => selectQuestion(q)}
              className="w-full terminal-card rounded-lg p-4 text-left hover:border-primary/30 transition-all duration-300 group">
              <div className="flex items-center justify-between">
                <div className="min-w-0">
                  <h3 className="font-bold text-foreground text-sm group-hover:text-primary transition-colors font-mono">{q.title}</h3>
                  {q.description && <p className="text-xs text-muted-foreground mt-1 truncate">{q.description}</p>}
                  {(q.company_tags || []).length > 0 && (
                    <div className="flex gap-1 mt-1.5">
                      {q.company_tags!.map(c => (
                        <span key={c} className="text-[10px] px-2 py-0.5 rounded-full bg-neon-cyan/10 text-neon-cyan font-mono">{c}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-4">
                  <span className={`text-xs font-mono font-bold ${diffColor(q.difficulty)}`}>{q.difficulty}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-mono">{q.language}</span>
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
