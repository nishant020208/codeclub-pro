import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import LoginPage from "@/pages/LoginPage";
import DashboardPage from "@/pages/DashboardPage";
import CoursesPage from "@/pages/CoursesPage";
import CourseDetailPage from "@/pages/CourseDetailPage";
import CodePage from "@/pages/CodePage";
import AiChatPage from "@/pages/AiChatPage";
import ProfilePage from "@/pages/ProfilePage";
import BadgesPage from "@/pages/BadgesPage";
import AchievementsPage from "@/pages/AchievementsPage";
import CompetitionsPage from "@/pages/CompetitionsPage";
import DSAPracticePage from "@/pages/DSAPracticePage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import ManageCoursesPage from "@/pages/admin/ManageCoursesPage";
import ManageQuizzesPage from "@/pages/admin/ManageQuizzesPage";
import ManageMembersPage from "@/pages/admin/ManageMembersPage";
import ManageDSAPage from "@/pages/admin/ManageDSAPage";
import ManageBadgesPage from "@/pages/admin/ManageBadgesPage";
import ManageAchievementsPage from "@/pages/admin/ManageAchievementsPage";
import ManageContestsPage from "@/pages/admin/ManageContestsPage";
import AdminProfilesPage from "@/pages/admin/AdminProfilesPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/courses" element={<CoursesPage />} />
                <Route path="/dashboard/courses/:courseId" element={<CourseDetailPage />} />
                <Route path="/dashboard/code" element={<CodePage />} />
                <Route path="/dashboard/dsa" element={<DSAPracticePage />} />
                <Route path="/dashboard/ai-chat" element={<AiChatPage />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/badges" element={<BadgesPage />} />
                <Route path="/dashboard/achievements" element={<AchievementsPage />} />
                <Route path="/dashboard/competitions" element={<CompetitionsPage />} />
                <Route path="/dashboard/leaderboard" element={<LeaderboardPage />} />
                {/* Admin routes */}
                <Route path="/dashboard/manage-courses" element={<ManageCoursesPage />} />
                <Route path="/dashboard/manage-quizzes" element={<ManageQuizzesPage />} />
                <Route path="/dashboard/manage-dsa" element={<ManageDSAPage />} />
                <Route path="/dashboard/manage-members" element={<ManageMembersPage />} />
                <Route path="/dashboard/manage-profiles" element={<AdminProfilesPage />} />
                <Route path="/dashboard/manage-badges" element={<ManageBadgesPage />} />
                <Route path="/dashboard/manage-achievements" element={<ManageAchievementsPage />} />
                <Route path="/dashboard/manage-contests" element={<ManageContestsPage />} />
                <Route path="/dashboard/analytics" element={<AnalyticsPage />} />
                <Route path="/dashboard/settings" element={<AdminSettingsPage />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
