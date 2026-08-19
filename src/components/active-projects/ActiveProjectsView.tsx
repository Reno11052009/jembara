"use client";

import { useState } from "react";
import { ActiveProject, ActiveProjectStatus } from "@/types/active-project";
import ActiveProjectFilterTabs from "@/components/active-projects/ActiveProjectFilterTabs";
import ProjectList from "@/components/active-projects/ProjectList";

type FilterValue = "Semua" | ActiveProjectStatus;

interface ActiveProjectsViewProps {
  projects: ActiveProject[];
  tabCounts: Record<ActiveProjectStatus, number>;
}

export default function ActiveProjectsView({
  projects,
  tabCounts,
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
      <ProjectList projects={filteredProjects} />
    </div>
  );
}