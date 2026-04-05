import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, CheckCircle, XCircle, GraduationCap, Zap, Trophy } from "lucide-react";
import { toast } from "sonner";
import { useBadgeCheck } from "@/hooks/useBadgeCheck";
import ModuleCard, { ModuleData } from "@/components/ModuleCard";
import { getCourseModules } from "@/data/courseModules";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

type Level = "beginner" | "intermediate" | "advanced";

const levelConfig: Record<Level, { label: string; icon: React.ElementType; color: string }> = {
  beginner: { label: "Beginner", icon: BookOpen, color: "text-primary" },
  intermediate: { label: "Intermediate", icon: Zap, color: "text-neon-amber" },
  advanced: { label: "Advanced", icon: Trophy, color: "text-destructive" },
};

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { checkBadges } = useBadgeCheck();
  const [course, setCourse] = useState<any>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [tab, setTab] = useState<"modules" | "quizzes">("modules");
  const [level, setLevel] = useState<Level>("beginner");
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
    setTimeout(() => checkBadges(), 1000);
  };

  const courseModules = course ? getCourseModules(course.title) : null;
  const currentModules: ModuleData[] = courseModules ? courseModules[level] : [];

  if (loading) return <div className="shimmer h-64 rounded-xl" />;
  if (!course) return <p className="text-muted-foreground">Course not found</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate("/dashboard/courses")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors font-mono">
        <ArrowLeft className="w-4 h-4" /> $ cd ../courses
      </button>

      {/* Course Header */}
      <div className="terminal-card rounded-lg p-6 border-primary/20">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">{course.title}</h1>
            <p className="text-sm text-muted-foreground font-mono">{course.description}</p>
          </div>
        </div>
      </div>

      {/* Main Tabs: Modules | Quizzes */}
      <div className="flex gap-1 p-1 rounded-lg bg-muted/30 w-fit border border-border">
        <button onClick={() => setTab("modules")} className={`px-4 py-2 rounded-md text-xs font-mono font-bold transition-all ${tab === "modules" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          Modules
        </button>
        <button onClick={() => setTab("quizzes")} className={`px-4 py-2 rounded-md text-xs font-mono font-bold transition-all ${tab === "quizzes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
          Quizzes ({quizzes.length})
        </button>
      </div>

      {tab === "modules" ? (
        <div className="space-y-4">
          {/* Level Tabs */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(levelConfig) as Level[]).map((l) => {
              const cfg = levelConfig[l];
              const Icon = cfg.icon;
              const count = courseModules ? courseModules[l].length : 0;
              return (
                <button
                  key={l}
                  onClick={() => setLevel(l)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-xs font-mono font-bold transition-all border ${
                    level === l
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {cfg.label} ({count})
                </button>
              );
            })}
          </div>

          {/* Module List */}
          {currentModules.length > 0 ? (
            <div className="space-y-3">
              {currentModules.map((mod, idx) => (
                <ModuleCard key={idx} module={mod} index={idx} totalModules={currentModules.length} />
              ))}
            </div>
          ) : (
            <div className="terminal-card rounded-lg p-8 text-center">
              <BookOpen className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-mono text-sm">No modules available for this level yet.</p>
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
                            isCorrect ? "border-primary bg-primary/10 text-primary"
                              : isWrong ? "border-destructive bg-destructive/10 text-destructive"
                              : isSelected ? "border-primary/50 bg-primary/5 text-primary"
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
