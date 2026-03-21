import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, CheckCircle, XCircle, FileText, Brain } from "lucide-react";
import { toast } from "sonner";
import { useBadgeCheck } from "@/hooks/useBadgeCheck";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { checkBadges } = useBadgeCheck();
  const [course, setCourse] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [tab, setTab] = useState<"theory" | "quizzes">("theory");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!courseId) return;
    Promise.all([
      supabase.from("courses").select("*").eq("id", courseId).single(),
      supabase.from("quizzes").select("*").eq("course_id", courseId).order("sort_order"),
    ]).then(([{ data: c }, { data: q }]) => {
      setCourse(c);
      setQuizzes((q || []).map((quiz: any) => ({
        ...quiz,
        options: Array.isArray(quiz.options) ? quiz.options : JSON.parse(quiz.options || "[]"),
      })));
      setLoading(false);
    });
  }, [courseId]);

  const handleSubmitQuiz = async () => {
    setSubmitted(true);
    const correct = quizzes.filter((q) => answers[q.id] === q.correct_answer).length;
    toast.success(`You scored ${correct}/${quizzes.length}!`);
    // Trigger badge check after quiz completion
    setTimeout(() => checkBadges(), 1000);
  };

  // Parse theory content into styled modules
  const renderTheoryContent = (content: string) => {
    if (!content) return null;

    // Split by headings or double newlines to create modules
    const sections = content.split(/(?=<h[1-3])|(?=#{1,3}\s)|(?:\n\n(?=[A-Z]))/g).filter(Boolean);

    if (sections.length <= 1) {
      // Single block - render with enhanced styling
      return (
        <div className="terminal-card rounded-lg p-6 border-primary/20">
          <div
            className="prose prose-invert max-w-none 
              prose-headings:text-primary prose-headings:font-mono prose-headings:border-b prose-headings:border-primary/20 prose-headings:pb-2
              prose-h1:text-xl prose-h2:text-lg prose-h3:text-base
              prose-p:text-muted-foreground prose-p:leading-relaxed prose-p:text-sm
              prose-strong:text-foreground
              prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
              prose-pre:bg-background prose-pre:border prose-pre:border-border prose-pre:rounded-lg
              prose-ul:text-muted-foreground prose-ol:text-muted-foreground
              prose-li:marker:text-primary
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      );
    }

    // Multiple sections - render as dynamic module boxes
    const colors = [
      { border: "border-primary/30", bg: "bg-primary/5", icon: "text-primary", accent: "bg-primary/10" },
      { border: "border-neon-cyan/30", bg: "bg-neon-cyan/5", icon: "text-neon-cyan", accent: "bg-neon-cyan/10" },
      { border: "border-neon-amber/30", bg: "bg-neon-amber/5", icon: "text-neon-amber", accent: "bg-neon-amber/10" },
      { border: "border-neon-purple/30", bg: "bg-neon-purple/5", icon: "text-neon-purple", accent: "bg-neon-purple/10" },
      { border: "border-destructive/30", bg: "bg-destructive/5", icon: "text-destructive", accent: "bg-destructive/10" },
    ];

    const icons = [BookOpen, FileText, Brain, BookOpen, FileText];

    return (
      <div className="grid grid-cols-1 gap-4">
        {sections.map((section, idx) => {
          const color = colors[idx % colors.length];
          const Icon = icons[idx % icons.length];
          // Extract a title from the section if it starts with a heading
          const titleMatch = section.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i) || section.match(/^#{1,3}\s+(.+)/m);
          const title = titleMatch ? titleMatch[1].replace(/<[^>]*>/g, "") : `Module ${idx + 1}`;
          const bodyContent = titleMatch ? section.replace(titleMatch[0], "") : section;

          return (
            <div
              key={idx}
              className={`terminal-card rounded-lg ${color.border} ${color.bg} overflow-hidden transition-all duration-300 hover:shadow-lg`}
            >
              {/* Module header */}
              <div className={`flex items-center gap-3 px-5 py-3 ${color.accent} border-b ${color.border}`}>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center ${color.accent}`}>
                  <Icon className={`w-4 h-4 ${color.icon}`} />
                </div>
                <div>
                  <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    Module {idx + 1}
                  </span>
                  <h3 className={`text-sm font-bold ${color.icon}`}>{title}</h3>
                </div>
              </div>
              {/* Module body */}
              <div className="px-5 py-4">
                <div
                  className="prose prose-invert max-w-none prose-sm
                    prose-headings:text-foreground prose-headings:font-mono
                    prose-p:text-muted-foreground prose-p:leading-relaxed
                    prose-strong:text-foreground
                    prose-code:text-primary prose-code:bg-primary/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
                    prose-pre:bg-background prose-pre:border prose-pre:border-border prose-pre:rounded-lg
                    prose-ul:text-muted-foreground prose-ol:text-muted-foreground
                    prose-li:marker:text-primary
                    prose-a:text-primary"
                  dangerouslySetInnerHTML={{ __html: bodyContent }}
                />
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  if (loading) return <div className="shimmer h-64 rounded-xl" />;
  if (!course) return <p className="text-muted-foreground">Course not found</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate("/dashboard/courses")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
        <ArrowLeft className="w-4 h-4" /> $ cd ../courses
      </button>

      <div className="terminal-card rounded-lg p-6 border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
            <p className="text-sm text-muted-foreground font-mono">{course.description}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/30 w-fit border border-border">
        <button
          onClick={() => setTab("theory")}
          className={`px-4 py-2 rounded-md text-xs font-mono font-bold transition-all ${
            tab === "theory" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Theory
        </button>
        <button
          onClick={() => setTab("quizzes")}
          className={`px-4 py-2 rounded-md text-xs font-mono font-bold transition-all ${
            tab === "quizzes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Quizzes ({quizzes.length})
        </button>
      </div>

      {tab === "theory" ? (
        <div>
          {course.theory_content ? (
            renderTheoryContent(course.theory_content)
          ) : (
            <div className="terminal-card rounded-lg p-8 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-mono text-sm">No theory content yet.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <div className="terminal-card rounded-lg p-8 text-center">
              <p className="text-muted-foreground font-mono text-sm">No quizzes available for this course.</p>
            </div>
          ) : (
            <>
              {quizzes.map((quiz, idx) => (
                <div key={quiz.id} className="terminal-card rounded-lg p-5">
                  <p className="font-bold text-foreground mb-3 text-sm">
                    <span className="text-primary font-mono mr-2">Q{idx + 1}.</span>
                    {quiz.question}
                  </p>
                  <div className="space-y-2">
                    {quiz.options.map((opt, oi) => {
                      const isSelected = answers[quiz.id] === oi;
                      const isCorrect = submitted && oi === quiz.correct_answer;
                      const isWrong = submitted && isSelected && oi !== quiz.correct_answer;
                      return (
                        <button
                          key={oi}
                          disabled={submitted}
                          onClick={() => setAnswers({ ...answers, [quiz.id]: oi })}
                          className={`w-full text-left px-4 py-3 rounded-md text-sm font-mono transition-all border ${
                            isCorrect
                              ? "border-primary bg-primary/10 text-primary"
                              : isWrong
                              ? "border-destructive bg-destructive/10 text-destructive"
                              : isSelected
                              ? "border-primary/50 bg-primary/5 text-primary"
                              : "border-border hover:border-primary/30 text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isCorrect && <CheckCircle className="w-4 h-4" />}
                            {isWrong && <XCircle className="w-4 h-4" />}
                            <span className="text-muted-foreground mr-1">{String.fromCharCode(65 + oi)}.</span>
                            {opt}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
              {!submitted && (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(answers).length < quizzes.length}
                  className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 transition-all disabled:opacity-50 glow-border font-mono"
                >
                  $ submit --quiz
                </button>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default CourseDetailPage;
