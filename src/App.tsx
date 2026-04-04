import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/layouts/DashboardLayout";
import React, { Suspense } from "react";

// Lazy-loaded pages for code splitting
const LandingPage = React.lazy(() => import("@/pages/LandingPage"));
const LoginPage = React.lazy(() => import("@/pages/LoginPage"));
const DashboardPage = React.lazy(() => import("@/pages/DashboardPage"));
const CoursesPage = React.lazy(() => import("@/pages/CoursesPage"));
const CourseDetailPage = React.lazy(() => import("@/pages/CourseDetailPage"));
const CodePage = React.lazy(() => import("@/pages/CodePage"));
const AiChatPage = React.lazy(() => import("@/pages/AiChatPage"));
const ProfilePage = React.lazy(() => import("@/pages/ProfilePage"));
const BadgesPage = React.lazy(() => import("@/pages/BadgesPage"));
const AchievementsPage = React.lazy(() => import("@/pages/AchievementsPage"));
const CompetitionsPage = React.lazy(() => import("@/pages/CompetitionsPage"));
const DSAPracticePage = React.lazy(() => import("@/pages/DSAPracticePage"));
const LeaderboardPage = React.lazy(() => import("@/pages/LeaderboardPage"));
const EventsPage = React.lazy(() => import("@/pages/EventsPage"));
const AnnouncementsPage = React.lazy(() => import("@/pages/AnnouncementsPage"));
const ResourcesPage = React.lazy(() => import("@/pages/ResourcesPage"));
const CertificatesPage = React.lazy(() => import("@/pages/CertificatesPage"));
const BattleModePage = React.lazy(() => import("@/pages/BattleModePage"));
const ForumPage = React.lazy(() => import("@/pages/ForumPage"));
const TeamsPage = React.lazy(() => import("@/pages/TeamsPage"));
const ResumeBuilderPage = React.lazy(() => import("@/pages/ResumeBuilderPage"));
const ManageCoursesPage = React.lazy(() => import("@/pages/admin/ManageCoursesPage"));
const ManageQuizzesPage = React.lazy(() => import("@/pages/admin/ManageQuizzesPage"));
const ManageMembersPage = React.lazy(() => import("@/pages/admin/ManageMembersPage"));
const ManageDSAPage = React.lazy(() => import("@/pages/admin/ManageDSAPage"));
const ManageBadgesPage = React.lazy(() => import("@/pages/admin/ManageBadgesPage"));
const ManageAchievementsPage = React.lazy(() => import("@/pages/admin/ManageAchievementsPage"));
const ManageContestsPage = React.lazy(() => import("@/pages/admin/ManageContestsPage"));
const ManageEventsPage = React.lazy(() => import("@/pages/admin/ManageEventsPage"));
const ManageAnnouncementsPage = React.lazy(() => import("@/pages/admin/ManageAnnouncementsPage"));
const ManageResourcesPage = React.lazy(() => import("@/pages/admin/ManageResourcesPage"));
const AdminProfilesPage = React.lazy(() => import("@/pages/admin/AdminProfilesPage"));
const AnalyticsPage = React.lazy(() => import("@/pages/admin/AnalyticsPage"));
const AdminSettingsPage = React.lazy(() => import("@/pages/admin/AdminSettingsPage"));
const CheatLogsPage = React.lazy(() => import("@/pages/admin/CheatLogsPage"));
const ResetPasswordPage = React.lazy(() => import("@/pages/ResetPasswordPage"));
const NotFound = React.lazy(() => import("@/pages/NotFound"));

const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-3">
      <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      <span className="text-xs font-mono text-muted-foreground">Loading module...</span>
    </div>
  </div>
);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/reset-password" element={<ResetPasswordPage />} />
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
          </Suspense>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
