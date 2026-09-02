"use client";

import { useRouter } from "next/navigation";
import type {
  ActiveProject,
  ActiveProjectStatus,
  ActiveProjectFilter,
  ActiveProjectsViewerRole,
} from "@/types/active-project";
import ActiveProjectFilterTabs from "@/components/active-projects/ActiveProjectFilterTabs";
import ProjectList from "@/components/active-projects/ProjectList";
import ListPagination from "@/components/ui/ListPagination";
import type { PaginationData } from "@/types/pagination";

type FilterValue = "Semua" | ActiveProjectStatus;

interface ActiveProjectsViewProps {
  projects: ActiveProject[];
  tabCounts: Record<ActiveProjectStatus, number>;
  viewerRole: ActiveProjectsViewerRole;
  emptyMessage: string;
  activeFilter: ActiveProjectFilter;
  pagination: PaginationData;
}

export default function ActiveProjectsView({
  projects,
  tabCounts,
  viewerRole,
  emptyMessage,
  activeFilter,
  pagination,
}: ActiveProjectsViewProps) {
  const router = useRouter();
  const setActiveFilter = (filter: FilterValue) => {
    const params = new URLSearchParams();
    if (filter !== "Semua") params.set("status", filter);
    const query = params.toString();
    router.replace(query ? `/dashboard/active-projects?${query}` : "/dashboard/active-projects");
  };

  return (
    <div className="flex flex-col gap-5">
      <ActiveProjectFilterTabs
        active={activeFilter}
        counts={tabCounts}
        onChange={setActiveFilter}
      />
      <ProjectList
        projects={projects}
        viewerRole={viewerRole}
        emptyMessage={emptyMessage}
      />
      <ListPagination
        basePath="/dashboard/active-projects"
        pagination={pagination}
        preservedParams={{ status: activeFilter === "Semua" ? null : activeFilter }}
      />
    </div>
  );
}
