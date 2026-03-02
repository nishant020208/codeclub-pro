import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BarChart3, Users, BookOpen, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const COLORS = [
  "hsl(172, 66%, 50%)",
  "hsl(160, 60%, 45%)",
  "hsl(200, 70%, 50%)",
  "hsl(280, 60%, 55%)",
  "hsl(340, 65%, 50%)",
];

const chartConfig: ChartConfig = {
  count: { label: "Count", color: "hsl(172, 66%, 50%)" },
  correct: { label: "Correct", color: "hsl(160, 60%, 45%)" },
  wrong: { label: "Wrong", color: "hsl(0, 72%, 51%)" },
  submissions: { label: "Submissions", color: "hsl(200, 70%, 50%)" },
};

interface Stats {
  totalMembers: number;
  totalCourses: number;
  totalQuizzes: number;
  totalDSA: number;
  totalSubmissions: number;
  quizAccuracy: number;
}

const AnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    totalMembers: 0, totalCourses: 0, totalQuizzes: 0,
    totalDSA: 0, totalSubmissions: 0, quizAccuracy: 0,
  });
  const [courseQuizData, setCourseQuizData] = useState<any[]>([]);
  const [dsaDifficultyData, setDsaDifficultyData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      const [members, courses, quizzes, dsaQ, attempts, submissions, activity] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("courses").select("id, title"),
        supabase.from("quizzes").select("id, course_id"),
        supabase.from("dsa_questions").select("id, difficulty"),
        supabase.from("quiz_attempts").select("id, is_correct, quiz_id"),
        supabase.from("dsa_submissions").select("id, question_id, status, created_at"),
        supabase.from("user_activity").select("activity_type, created_at"),
      ]);

      const attemptsData = attempts.data || [];
      const correctCount = attemptsData.filter((a: any) => a.is_correct).length;
      const accuracy = attemptsData.length > 0 ? Math.round((correctCount / attemptsData.length) * 100) : 0;

      setStats({
        totalMembers: members.count || 0,
        totalCourses: (courses.data || []).length,
        totalQuizzes: (quizzes.data || []).length,
        totalDSA: (dsaQ.data || []).length,
        totalSubmissions: (submissions.data || []).length,
        quizAccuracy: accuracy,
      });

      // Course quiz distribution
      const courseMap = new Map<string, { name: string; quizzes: number; attempts: number }>();
      (courses.data || []).forEach((c: any) => courseMap.set(c.id, { name: c.title.slice(0, 15), quizzes: 0, attempts: 0 }));
      (quizzes.data || []).forEach((q: any) => {
        const entry = courseMap.get(q.course_id);
        if (entry) entry.quizzes++;
      });
      attemptsData.forEach((a: any) => {
        const quiz = (quizzes.data || []).find((q: any) => q.id === a.quiz_id);
        if (quiz) {
          const entry = courseMap.get(quiz.course_id);
          if (entry) entry.attempts++;
        }
      });
      setCourseQuizData(Array.from(courseMap.values()).slice(0, 8));

      // DSA difficulty distribution
      const diffMap: Record<string, number> = { Easy: 0, Medium: 0, Hard: 0 };
      (dsaQ.data || []).forEach((q: any) => { diffMap[q.difficulty] = (diffMap[q.difficulty] || 0) + 1; });
      setDsaDifficultyData(Object.entries(diffMap).map(([name, value]) => ({ name, value })));

      // Activity over last 7 days
      const days: Record<string, number> = {};
      for (let i = 6; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        days[d.toISOString().slice(0, 10)] = 0;
      }
      (activity.data || []).forEach((a: any) => {
        const day = a.created_at.slice(0, 10);
        if (days[day] !== undefined) days[day]++;
      });
      setActivityData(Object.entries(days).map(([date, count]) => ({
        date: date.slice(5),
        count,
      })));

      setLoading(false);
    };
    fetchAll();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="shimmer h-28 rounded-xl" />)}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3].map(i => <div key={i} className="shimmer h-72 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          <span className="gradient-text">Analytics</span> Dashboard
        </h1>
        <p className="text-muted-foreground mt-1">Real-time platform insights</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { icon: Users, label: "Members", value: stats.totalMembers },
          { icon: BookOpen, label: "Courses", value: stats.totalCourses },
          { icon: BarChart3, label: "Quizzes", value: stats.totalQuizzes },
          { icon: TrendingUp, label: "DSA Problems", value: stats.totalDSA },
          { icon: Target, label: "Quiz Accuracy", value: `${stats.quizAccuracy}%` },
        ].map((s) => (
          <div key={s.label} className="glass-card rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <s.icon className="w-4 h-4 text-primary" />
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Quiz Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Quizzes per Course</CardTitle>
          </CardHeader>
          <CardContent>
            {courseQuizData.length > 0 ? (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <BarChart data={courseQuizData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                  <XAxis dataKey="name" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
                  <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 10 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="quizzes" fill="hsl(172, 66%, 50%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">No quiz data yet</p>
            )}
          </CardContent>
        </Card>

        {/* DSA Difficulty Pie */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">DSA by Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            {dsaDifficultyData.some(d => d.value > 0) ? (
              <ChartContainer config={chartConfig} className="h-[250px] w-full">
                <PieChart>
                  <Pie data={dsaDifficultyData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                    {dsaDifficultyData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ChartContainer>
            ) : (
              <p className="text-center text-muted-foreground py-12">No DSA data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Activity Trend */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-foreground">Activity (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px] w-full">
              <LineChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
                <XAxis dataKey="date" tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(215, 20%, 55%)", fontSize: 11 }} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line type="monotone" dataKey="count" stroke="hsl(172, 66%, 50%)" strokeWidth={2} dot={{ fill: "hsl(172, 66%, 50%)" }} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
