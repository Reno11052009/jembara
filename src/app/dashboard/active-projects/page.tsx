import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import ActiveProjectsView from "@/components/active-projects/ActiveProjectsView";
import MonthlyActivityCard from "@/components/active-projects/MonthlyActivityCard";
import CollaborationTipsCard from "@/components/active-projects/CollaborationTipsCard";
import { getActiveProjectsData } from "@/lib/active-projects";

export default async function ActiveProjectsPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[]; status?: string | string[] }>;
}) {
  const query = await searchParams;
  const data = await getActiveProjectsData(query);
  const summaryTitle =
    data.role === "STUDENT"
      ? "Ringkasan Proyek Saya"
      : data.role === "UMKM"
        ? "Ringkasan Kolaborasi UMKM"
        : "Ringkasan Platform";

  return (
    <>
      <DashboardPageHeader
        title={data.pageTitle}
        subtitle={data.pageSubtitle}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActiveProjectsView
            projects={data.projects}
            tabCounts={data.tabCounts}
            viewerRole={data.role}
            emptyMessage={data.emptyMessage}
            activeFilter={data.activeFilter}
            pagination={data.pagination}
          />
        </div>

        <div className="flex flex-col gap-6">
          <div className="sticky top-24 flex flex-col gap-6">
            <MonthlyActivityCard
              title={summaryTitle}
              metrics={data.metrics}
            />
            <CollaborationTipsCard tip={data.collaborationTip} />
          </div>
        </div>
      </div>
    </>
  );
}
