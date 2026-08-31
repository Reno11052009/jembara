"use client";

import { useState } from "react";
import type {
  ActiveProject,
  ActiveProjectStatus,
  ActiveProjectsViewerRole,
} from "@/types/active-project";
import ActiveProjectFilterTabs from "@/components/active-projects/ActiveProjectFilterTabs";
import ProjectList from "@/components/active-projects/ProjectList";

type FilterValue = "Semua" | ActiveProjectStatus;

interface ActiveProjectsViewProps {
  projects: ActiveProject[];
  tabCounts: Record<ActiveProjectStatus, number>;
  viewerRole: ActiveProjectsViewerRole;
  emptyMessage: string;
}

export default function ActiveProjectsView({
  projects,
  tabCounts,
  viewerRole,
  emptyMessage,
}: ActiveProjectsViewProps) {
  const [activeFilter, setActiveFilter] = useState<FilterValue>("Semua");

  const filteredProjects =
    activeFilter === "Semua"
      ? projects
      : projects.filter((project) => project.status === activeFilter);

  return (
    <div className="flex flex-col gap-5">
      <ActiveProjectFilterTabs
        active={activeFilter}
        counts={tabCounts}
        onChange={setActiveFilter}
      />
      <ProjectList
        projects={filteredProjects}
        viewerRole={viewerRole}
        emptyMessage={emptyMessage}
      />
    </div>
  );
}
