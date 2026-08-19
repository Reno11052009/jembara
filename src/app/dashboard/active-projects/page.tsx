import PageHeader from "@/components/layout/PageHeader";
import ActiveProjectsView from "@/components/active-projects/ActiveProjectsView";
import MonthlyActivityCard from "@/components/active-projects/MonthlyActivityCard";
import CollaborationTipsCard from "@/components/active-projects/CollaborationTipsCard";
import {
  activeProjects,
  activeProjectTabCounts,
  monthlyActivityStats,
  collaborationTip,
} from "@/lib/mock-active-project";

export default function ActiveProjectsPage() {
  return (
    <>
      <PageHeader
        title="Active Projects"
        subtitle="Pantau dan selesaikan project kolaborasi berjalan Anda."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ActiveProjectsView
            projects={activeProjects}
            tabCounts={activeProjectTabCounts}
          />
        </div>

        <div className="flex flex-col gap-6">
           <div className="sticky top-24 flex flex-col gap-6">
          <MonthlyActivityCard stats={monthlyActivityStats} />
          <CollaborationTipsCard tip={collaborationTip} />
        </div>
      </div>
    </div>
    </>
  );
}