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
import Footer from "@/components/landing/Footer";
import ProfileCompletionBanner from "@/components/dashboard/ProfileCompletionBanner";
import StatCard from "@/components/dashboard/StatCard";
import RecommendedProjectCard from "@/components/dashboard/RecommendedProjectCard";
import RunningActivityCard from "@/components/dashboard/RunningActivityCard";
import ManagedProjectCard from "@/components/dashboard/ManagedProjectCard";
import RecentNotificationsCard from "@/components/dashboard/RecentNotificationsCard";
import { getDashboardData } from "@/lib/dashboard";

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

const dashboardSubtitles = {
  STUDENT: "Berikut aktivitas, rekomendasi proyek, dan perkembangan reputasi kamu.",
  UMKM: "Pantau proyek, proposal masuk, dan aktivitas kolaborasi bisnis Anda.",
  ADMIN: "Pantau pertumbuhan pengguna dan aktivitas proyek di platform Jembara.",
};

export default async function DashboardPage() {
  const dashboard = await getDashboardData();
  const firstName = dashboard.userName.trim().split(/\s+/)[0] || "Pengguna";

  return (
    <>
      <PageHeader
        title={`Halo, ${firstName}! 👋`}
        subtitle={dashboardSubtitles[dashboard.role]}
        userName={dashboard.userName}
        avatarUrl={dashboard.avatarUrl}
      />

      <div className="flex flex-col gap-6">
        {dashboard.role !== "ADMIN" && dashboard.profileCompletionPercent < 100 && (
          <ProfileCompletionBanner
            percent={dashboard.profileCompletionPercent}
            role={dashboard.role}
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
              {dashboard.projectSectionTitle}
            </h2>
            <div className="flex flex-col gap-7">
              {dashboard.role === "STUDENT"
                ? dashboard.recommendedProjects.map((project) => (
                    <RecommendedProjectCard key={project.id} project={project} />
                  ))
                : dashboard.managedProjects.map((project) => (
                    <ManagedProjectCard key={project.id} project={project} />
                  ))}

              {dashboard.recommendedProjects.length === 0 &&
                dashboard.managedProjects.length === 0 && (
                  <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-10 text-center">
                    <p className="text-sm text-ink-muted">
                      {dashboard.projectSectionEmptyMessage}
                    </p>
                  </div>
                )}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {dashboard.role !== "ADMIN" && (
              <RunningActivityCard activities={dashboard.runningActivities} />
            )}
            <RecentNotificationsCard notifications={dashboard.notifications} />
          </div>
        </div>
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
