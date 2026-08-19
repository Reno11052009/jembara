import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import ProfileCompletionBanner from "@/components/dashboard/ProfileCompletionBanner";
import StatCard from "@/components/dashboard/StatCard";
import RecommendedProjectCard from "@/components/dashboard/RecommendedProjectCard";
import RunningActivityCard from "@/components/dashboard/RunningActivityCard";
import RecentMessagesCard from "@/components/dashboard/RecentMessagesCard";
import {
  profileCompletionPercent,
  dashboardStats,
  recommendedProjects,
  runningActivities,
  recentMessages,
} from "@/lib/mock-dashboard";

export default function DashboardPage() {
  return (
    <>
      <PageHeader
        title ="Halo, Chello! 👋"
        subtitle="Berikut adalah update aktivitas project dan kecocokan hari ini."
      />

      <div className="flex flex-col gap-6">
        <ProfileCompletionBanner percent={profileCompletionPercent} />

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat) => (
            <StatCard key={stat.id} stat={stat} />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <h2 className="text-lg font-display font-black text-ink">
              Project yang Cocok Untukmu
            </h2>
            <div className="mt-5 flex flex-col gap-7">
              {recommendedProjects.map((project) => (
                <RecommendedProjectCard key={project.id} project={project} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <RunningActivityCard activities={runningActivities} />
            <RecentMessagesCard messages={recentMessages} />
          </div>
        </div>
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
