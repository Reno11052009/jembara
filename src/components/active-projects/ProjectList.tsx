import type {
  ActiveProject,
  ActiveProjectsViewerRole,
} from "@/types/active-project";
import ProjectCard from "@/components/active-projects/ProjectCard";

interface ProjectListProps {
  projects: ActiveProject[];
  viewerRole: ActiveProjectsViewerRole;
  emptyMessage: string;
}

export default function ProjectList({
  projects,
  viewerRole,
  emptyMessage,
}: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-hairline bg-card p-8 text-center text-sm text-ink-muted">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          viewerRole={viewerRole}
        />
      ))}
    </div>
  );
}
