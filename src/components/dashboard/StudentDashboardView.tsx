"use client";

import {
  BarChart3,
  Briefcase,
  CheckCircle2,
  FileText,
  FolderKanban,
  Inbox,
  Star,
  Users,
} from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import ProfileCompletionBanner from "@/components/dashboard/ProfileCompletionBanner";
import StatCard from "@/components/dashboard/StatCard";
import RecommendedProjectCard from "@/components/dashboard/RecommendedProjectCard";
import RunningActivityCard from "@/components/dashboard/RunningActivityCard";
import RecentNotificationsCard from "@/components/dashboard/RecentNotificationsCard";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { DashboardData } from "@/types/dashboard";

const metricIcons = {
  proposals: FileText,
  proposals_received: Inbox,
  active: Briefcase,
  completed: CheckCircle2,
  rating: Star,
  projects: FolderKanban,
  users: Users,
  open: BarChart3,
};

export default function StudentDashboardView({ dashboard }: { dashboard: DashboardData }) {
  const { dict: t } = usePreferences();
  const firstName = dashboard.userName.trim().split(/\s+/)[0] || "Pengguna";

  const greeting =
    t.dashboard.welcome === "Welcome Back"
      ? `Hello, ${firstName}!`
      : t.dashboard.welcome === "おかえりなさい"
      ? `こんにちは、${firstName}さん！`
      : `Halo, ${firstName}!`;

  const emptyMsg =
    dashboard.projectSectionEmptyMessage.includes("Tambahkan skill")
      ? t.dashboard.emptyRecommendedNoSkill
      : t.dashboard.emptyRecommended;

  return (
    <>
      <PageHeader
        title={greeting}
        subtitle={t.dashboard.subtitleStudent}
        userName={dashboard.userName}
        avatarUrl={dashboard.avatarUrl}
      />

      <div className="flex flex-col gap-6">
        {dashboard.profileCompletionPercent < 100 && (
          <ProfileCompletionBanner
            percent={dashboard.profileCompletionPercent}
            role={dashboard.role === "UMKM" ? "UMKM" : "STUDENT"}
          />
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dashboard.metrics.map((metric) => {
            const icon = metricIcons[metric.id as keyof typeof metricIcons] ?? BarChart3;
            return <StatCard key={metric.id} stat={{ ...metric, icon }} />;
          })}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-6.5 lg:col-span-2">
            <h2 className="text-lg font-display font-black text-ink">
              {t.dashboard.recommendedProjectsTitle}
            </h2>
            <div className="flex flex-col gap-7">
              {dashboard.recommendedProjects.map((project) => (
                <RecommendedProjectCard key={project.id} project={project} />
              ))}

              {dashboard.recommendedProjects.length === 0 && (
                <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-10 text-center">
                  <p className="text-sm text-ink-muted">
                    {emptyMsg}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 lg:pt-14">
            <RunningActivityCard activities={dashboard.runningActivities} />
            <RecentNotificationsCard notifications={dashboard.notifications} />
          </div>
        </div>
      </div>
    </>
  );
}
