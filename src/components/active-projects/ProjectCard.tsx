import { ActiveProject } from "@/types/active-project";
import Button from "@/components/ui/Button";
import ProgressBar from "@/components/active-projects/ProgressBar";
import MilestoneChecklist from "@/components/active-projects/MilestoneChecklist";

interface ProjectCardProps {
  project: ActiveProject;
}

const statusStyles: Record<ActiveProject["status"], string> = {
  "In Progress": "bg-brand-soft text-brand",
  "In Review": "bg-blue-50 text-blue-600",
  Completed: "bg-success/10 text-success",
};

export default function ProjectCard({ project }: ProjectCardProps) {
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
              {project.clientName}  
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-black font-display leading-none ${statusStyles[project.status]}`}
        >
          {project.status}
        </span>
      </div>

      <div className="mt-5">
        <ProgressBar percent={project.progressPercent} />
      </div>

      <div className="mt-4">
        <MilestoneChecklist milestones={project.milestones} />
      </div>

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
        </div>

        <div className="flex gap-3">
          <Button variant="outline" className="border-2 px-5 py-2 text-xs">
            Lihat Detail
          </Button>
          <Button variant="primary" className="px-5 py-2 text-xs">
            Kirim Update
          </Button>
        </div>
      </div>
    </div>
  );
}