import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import LandingPage from "@/pages/LandingPage";
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
import EventsPage from "@/pages/EventsPage";
import AnnouncementsPage from "@/pages/AnnouncementsPage";
import ResourcesPage from "@/pages/ResourcesPage";
import CertificatesPage from "@/pages/CertificatesPage";
import BattleModePage from "@/pages/BattleModePage";
import ForumPage from "@/pages/ForumPage";
import TeamsPage from "@/pages/TeamsPage";
import ResumeBuilderPage from "@/pages/ResumeBuilderPage";
import ManageCoursesPage from "@/pages/admin/ManageCoursesPage";
import ManageQuizzesPage from "@/pages/admin/ManageQuizzesPage";
import ManageMembersPage from "@/pages/admin/ManageMembersPage";
import ManageDSAPage from "@/pages/admin/ManageDSAPage";
import ManageBadgesPage from "@/pages/admin/ManageBadgesPage";
import ManageAchievementsPage from "@/pages/admin/ManageAchievementsPage";
import ManageContestsPage from "@/pages/admin/ManageContestsPage";
import ManageEventsPage from "@/pages/admin/ManageEventsPage";
import ManageAnnouncementsPage from "@/pages/admin/ManageAnnouncementsPage";
import ManageResourcesPage from "@/pages/admin/ManageResourcesPage";
import AdminProfilesPage from "@/pages/admin/AdminProfilesPage";
import AnalyticsPage from "@/pages/admin/AnalyticsPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import CheatLogsPage from "@/pages/admin/CheatLogsPage";
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
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/courses" element={<CoursesPage />} />
                <Route path="/dashboard/courses/:courseId" element={<CourseDetailPage />} />
                <Route path="/dashboard/code" element={<CodePage />} />
                <Route path="/dashboard/dsa" element={<DSAPracticePage />} />
                <Route path="/dashboard/battles" element={<BattleModePage />} />
                <Route path="/dashboard/forum" element={<ForumPage />} />
                <Route path="/dashboard/teams" element={<TeamsPage />} />
                <Route path="/dashboard/resume" element={<ResumeBuilderPage />} />
                <Route path="/dashboard/ai-chat" element={<AiChatPage />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
                <Route path="/dashboard/badges" element={<BadgesPage />} />
                <Route path="/dashboard/achievements" element={<AchievementsPage />} />
                <Route path="/dashboard/competitions" element={<CompetitionsPage />} />
                <Route path="/dashboard/leaderboard" element={<LeaderboardPage />} />
                <Route path="/dashboard/events" element={<EventsPage />} />
                <Route path="/dashboard/announcements" element={<AnnouncementsPage />} />
                <Route path="/dashboard/resources" element={<ResourcesPage />} />
                <Route path="/dashboard/certificates" element={<CertificatesPage />} />
                {/* Admin routes */}
                <Route path="/dashboard/manage-courses" element={<ManageCoursesPage />} />
                <Route path="/dashboard/manage-quizzes" element={<ManageQuizzesPage />} />
                <Route path="/dashboard/manage-dsa" element={<ManageDSAPage />} />
                <Route path="/dashboard/manage-contests" element={<ManageContestsPage />} />
                <Route path="/dashboard/manage-events" element={<ManageEventsPage />} />
                <Route path="/dashboard/manage-announcements" element={<ManageAnnouncementsPage />} />
                <Route path="/dashboard/manage-resources" element={<ManageResourcesPage />} />
                <Route path="/dashboard/manage-members" element={<ManageMembersPage />} />
                <Route path="/dashboard/manage-profiles" element={<AdminProfilesPage />} />
                <Route path="/dashboard/manage-badges" element={<ManageBadgesPage />} />
                <Route path="/dashboard/manage-achievements" element={<ManageAchievementsPage />} />
                <Route path="/dashboard/cheat-logs" element={<CheatLogsPage />} />
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
