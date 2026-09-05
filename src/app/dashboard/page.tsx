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
import OwnerDashboardView from "@/components/dashboard/umkm/OwnerDashboardView";
import AdminDashboardView from "@/components/dashboard/admin/AdminDashboardView";
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

export const instant = false;

export default async function DashboardPage() {
  const dashboard = await getDashboardData();

  // Tampilan UMKM memakai istilah lowongan/pelamar, sedangkan sumber tepercayanya
  // tetap project/proposal yang difilter berdasarkan pemilik pada server.
  if (dashboard.role === "UMKM") {
    if (!dashboard.umkmOverview) {
      throw new Error("Data dashboard UMKM tidak tersedia");
    }

    return (
      <OwnerDashboardView
        ownerName={dashboard.userName}
        ownerAvatarUrl={dashboard.avatarUrl}
        data={dashboard.umkmOverview}
      />
    );
  }

  // Admin memakai tampilan khusus, tetapi seluruh datanya tetap berasal dari
  // pipeline getDashboardData() yang sudah mengautorisasi sesi di server.
  if (dashboard.role === "ADMIN") {
    if (!dashboard.adminOverview) {
      throw new Error("Data dashboard admin tidak tersedia");
    }

    return (
      <AdminDashboardView
        adminName={dashboard.userName}
        data={dashboard.adminOverview}
      />
    );
  }

  const firstName = dashboard.userName.trim().split(/\s+/)[0] || "Pengguna";

  return (
    <>
      <PageHeader
        title={`Halo, ${firstName}!`}
        subtitle={dashboardSubtitles[dashboard.role]}
        userName={dashboard.userName}
        avatarUrl={dashboard.avatarUrl}
      />

      <div className="flex flex-col gap-6">
        {dashboard.profileCompletionPercent < 100 && (
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
              {dashboard.recommendedProjects.map((project) => (
                <RecommendedProjectCard key={project.id} project={project} />
              ))}

              {dashboard.recommendedProjects.length === 0 && (
                <div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-10 text-center">
                  <p className="text-sm text-ink-muted">
                    {dashboard.projectSectionEmptyMessage}
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