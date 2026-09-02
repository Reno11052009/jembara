import Link from "next/link";
import { BriefcaseBusiness, TrendingUp } from "lucide-react";
import { Project } from "@/types/project";
import ShareProjectButton from "@/components/projects/ShareProjectButton";

interface ProjectCardProps {
  project: Project;
  showStudentFeatures?: boolean;
}

export default function ProjectCard({
  project,
  showStudentFeatures = true,
}: ProjectCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-base font-black text-ink">
          {project.title}
        </h3>
        {showStudentFeatures ? (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-display font-black text-brand">
            <TrendingUp size={14} />
            {project.skillMatchPercent}% Skill Match
          </span>
        ) : (
          <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-display font-black text-brand">
            <BriefcaseBusiness size={14} />
            Project OPEN
          </span>
        )}
      </div>

      <p className="mt-0 text-sm font-body text-ink-muted">{project.companyName}</p>
      <p className="mt-3 text-sm font-body text-ink-muted">{project.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-canvas px-2.5 py-1 text-sm  font-body text-ink"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex flex-wrap items-start gap-x-5 gap-y-3 text-xs">
        <div>
          <p className="text-ink-muted">Budget</p>
          <p className="mt-0.5 font-display font-black text-ink text-base">{project.budgetLabel}</p>
        </div>
        <div>
          <p className="text-ink-muted">Deadline</p>
          <p className="mt-0.5 font-display font-black text-ink text-base">{project.deadlineLabel}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="shrink-0">
            <p className="text-ink-muted">Lokasi</p>
            <p className="mt-0.5 font-display font-black text-ink text-base">{project.locationLabel}</p>
          </div>
          {showStudentFeatures && (
            <div className="min-w-0 flex-1">
              <div className="flex justify-between text-xs text-ink-muted">
                <span>{project.skillMatchReason}</span>
                <span className="ml-1 font-body font-bold text-brand">{project.skillMatchPercent}%</span>
              </div>
              <div className="mt-1 h-2 w-70 overflow-hidden rounded-full bg-[#EAEAEA]">
                <div
                  className="h-full rounded-full bg-brand"
                  style={{ width: `${project.skillMatchPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-3">
        <Link
          href={`/dashboard/find-projects/${project.id}`}
          className="rounded-[99px] bg-brand px-6 py-2.5 text-sm font-display font-bold uppercase text-white transition-opacity hover:opacity-90"
        >
          Lihat Project
        </Link>
        <ShareProjectButton
          projectId={project.id}
          projectTitle={project.title}
        />
      </div>
    </div>
  );
}
