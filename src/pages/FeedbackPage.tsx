import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquarePlus, Send, Mail, CheckCircle, Clock, AlertCircle } from "lucide-react";

const CATEGORIES = ["general", "bug_report", "feature_request", "course_feedback", "dsa_feedback", "other"];

const FeedbackPage: React.FC = () => {
  const { user } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState("general");
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("feedback")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setHistory(data || []);
        setLoading(false);
      });
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !subject.trim() || !message.trim()) {
      toast.error("Please fill all fields");
      return;
    }
    setSubmitting(true);
    const { error, data } = await supabase.from("feedback").insert({
      user_id: user.id,
      category,
      subject: subject.trim(),
      message: message.trim(),
    } as any).select().single();
    setSubmitting(false);
    if (error) {
      toast.error("Failed to submit feedback");
    } else {
      toast.success("Feedback submitted! Thank you.");
      setSubject("");
      setMessage("");
      setCategory("general");
      if (data) setHistory([data, ...history]);
    }
  };

  const statusIcon = (s: string) => {
    if (s === "resolved") return <CheckCircle className="w-3.5 h-3.5 text-primary" />;
    if (s === "in_progress") return <Clock className="w-3.5 h-3.5 text-neon-amber" />;
    return <AlertCircle className="w-3.5 h-3.5 text-muted-foreground" />;
  };

  return (
    <div className="max-w-3xl space-y-6 animate-fade-in">
      <div>
        <p className="text-sm text-muted-foreground font-mono mb-1">$ feedback --submit</p>
        <h1 className="text-2xl font-bold text-foreground">
          <span className="text-primary">Feedback</span> & Support
        </h1>
      </div>

      {/* Contact info */}
      <div className="terminal-card rounded-lg p-4 flex items-center gap-3">
        <Mail className="w-5 h-5 text-primary shrink-0" />
        <div>
          <p className="text-sm text-foreground font-medium">Direct Contact</p>
          <a href="mailto:nishu0202084@gmail.com" className="text-xs text-primary font-mono hover:underline">
            nishu0202084@gmail.com
          </a>
          <p className="text-[10px] text-muted-foreground mt-0.5">You can also email us directly for urgent issues</p>
        </div>
      </div>

      {/* Submit form */}
      <div className="terminal-card rounded-lg p-6">
        <div className="flex items-center gap-2 mb-4">
          <MessageSquarePlus className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Submit Feedback</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary font-mono">category:</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground font-mono text-sm focus:ring-1 focus:ring-primary">
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>{c.replace(/_/g, " ")}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-primary font-mono">subject:</label>
              <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Brief subject"
                className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground font-mono text-sm focus:ring-1 focus:ring-primary" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-primary font-mono">message:</label>
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5}
              placeholder="Describe your feedback, suggestion, or issue in detail..."
              className="w-full px-4 py-3 rounded-md bg-background border border-border text-foreground font-mono text-sm focus:ring-1 focus:ring-primary resize-none" />
          </div>
          <button type="submit" disabled={submitting}
            className="flex items-center gap-2 px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-all disabled:opacity-50 glow-border">
            <Send className="w-4 h-4" />
            {submitting ? "sending..." : "$ submit_feedback"}
          </button>
        </form>
      </div>

      {/* History */}
      <div>
        <h3 className="text-sm font-bold text-foreground font-mono mb-3">// Your submissions</h3>
        {loading ? (
          <div className="space-y-2">{[1, 2].map(i => <div key={i} className="shimmer h-16 rounded-lg" />)}</div>
        ) : history.length === 0 ? (
          <p className="text-xs text-muted-foreground font-mono">No feedback submitted yet.</p>
        ) : (
          <div className="space-y-2">
            {history.map((fb: any) => (
              <div key={fb.id} className="terminal-card rounded-lg p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {statusIcon(fb.status)}
                      <span className="text-sm font-bold text-foreground">{fb.subject}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono">
                        {fb.category?.replace(/_/g, " ")}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{fb.message}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                    {new Date(fb.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeedbackPage;
