import type {
  ActiveProject,
  ActiveProjectsViewerRole,
} from "@/types/active-project";
import ProjectWorkflowActions from "@/components/active-projects/ProjectWorkflowActions";

interface ProjectCardProps {
  project: ActiveProject;
  viewerRole: ActiveProjectsViewerRole;
}

const statusStyles: Record<ActiveProject["status"], string> = {
  "In Progress": "bg-brand-soft text-brand",
  "In Review": "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400",
  Completed: "bg-success/10 text-success",
};

export default function ProjectCard({ project, viewerRole }: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-display font-black text-brand">
            {project.clientName
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
          <div>
            <h3 className="font-display text-base font-black text-ink">
              {project.title}
            </h3>
            <p className="mt-0.5 font-body text-sm text-ink-muted">
              {project.counterpartLabel}: {project.clientName}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-black font-display leading-none ${statusStyles[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      {project.tags && project.tags.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-canvas px-2.5 py-1 text-xs font-body text-ink"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-6">
          <div>
            <p className="font-body text-xs text-ink-muted">Budget</p>
            <p className="mt-0.5 font-display text-sm font-black text-ink">
              {project.budgetLabel}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-ink-muted">Deadline</p>
            <p className="mt-0.5 font-body text-base font-bold text-brand">
              {project.deadlineLabel}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-ink-muted">Update Terakhir</p>
            <p className="mt-0.5 font-body text-sm font-bold text-ink">
              {project.updatedLabel}
            </p>
          </div>
        </div>

        {viewerRole !== "STUDENT" && (
          <div className="rounded-lg bg-canvas px-4 py-3 text-right">
            <p className="font-body text-xs text-ink-muted">Proposal Masuk</p>
            <p className="mt-0.5 font-display text-sm font-black text-ink">
              {project.proposalCount ?? 0} Proposal
            </p>
          </div>
        )}
      </div>
      {project.paymentStatus === "HELD" && (
        <p className="mt-4 rounded-lg bg-success/10 px-4 py-3 text-xs font-semibold text-success">
          Dana proyek sudah diamankan dan ditahan sampai hasil disetujui UMKM.
        </p>
      )}
      <ProjectWorkflowActions project={project} />
    </div>
  );
}
