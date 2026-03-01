import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, BookOpen, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: number;
}

const CourseDetailPage: React.FC = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
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

  const handleSubmitQuiz = () => {
    setSubmitted(true);
    const correct = quizzes.filter((q) => answers[q.id] === q.correct_answer).length;
    toast.success(`You scored ${correct}/${quizzes.length}!`);
  };

  if (loading) return <div className="shimmer h-64 rounded-xl" />;
  if (!course) return <p className="text-muted-foreground">Course not found</p>;

  return (
    <div className="space-y-6 animate-fade-in">
      <button onClick={() => navigate("/dashboard/courses")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to Courses
      </button>

      <div>
        <h1 className="text-3xl font-bold text-foreground">{course.title}</h1>
        <p className="text-muted-foreground mt-1">{course.description}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl bg-secondary/50 w-fit">
        <button
          onClick={() => setTab("theory")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "theory" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Theory
        </button>
        <button
          onClick={() => setTab("quizzes")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            tab === "quizzes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Quizzes ({quizzes.length})
        </button>
      </div>

      {tab === "theory" ? (
        <div className="glass-card rounded-xl p-8 prose prose-invert max-w-none">
          {course.theory_content ? (
            <div dangerouslySetInnerHTML={{ __html: course.theory_content }} />
          ) : (
            <p className="text-muted-foreground">No theory content yet.</p>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          {quizzes.length === 0 ? (
            <div className="glass-card rounded-xl p-8 text-center">
              <p className="text-muted-foreground">No quizzes available for this course.</p>
            </div>
          ) : (
            <>
              {quizzes.map((quiz, idx) => (
                <div key={quiz.id} className="glass-card rounded-xl p-6">
                  <p className="font-medium text-foreground mb-3">
                    {idx + 1}. {quiz.question}
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
                          className={`w-full text-left px-4 py-3 rounded-lg text-sm transition-all border ${
                            isCorrect
                              ? "border-accent bg-accent/10 text-accent"
                              : isWrong
                              ? "border-destructive bg-destructive/10 text-destructive"
                              : isSelected
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/30 text-foreground"
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            {isCorrect && <CheckCircle className="w-4 h-4" />}
                            {isWrong && <XCircle className="w-4 h-4" />}
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
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all disabled:opacity-50"
                >
                  Submit Quiz
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
