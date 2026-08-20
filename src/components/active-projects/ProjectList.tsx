import { ActiveProject } from "@/types/active-project";
import ProjectCard from "@/components/active-projects/ProjectCard";

interface ProjectListProps {
  projects: ActiveProject[];
}

export default function ProjectList({ projects }: ProjectListProps) {
  if (projects.length === 0) {
    return (
      <div className="rounded-xl border border-hairline bg-card p-8 text-center text-sm text-ink-muted">
        Belum ada project di kategori ini.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}