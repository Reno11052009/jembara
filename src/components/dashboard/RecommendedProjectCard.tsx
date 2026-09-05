import { Flame } from "lucide-react";
import Link from "next/link";
import { RecommendedProject } from "@/types/dashboard";

interface RecommendedProjectCardProps {
  project: RecommendedProject;
}

export default function RecommendedProjectCard({
  project,
}: RecommendedProjectCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-4 sm:p-5">
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div>
          <h3 className="font-display text-base font-black text-ink">
            {project.title}
          </h3>
          <p className="mt-1 text-sm font-body font-normal text-ink-muted">
            {project.companyName}
          </p>
        </div>
        <span className="inline-flex self-start sm:self-auto shrink-0 items-center justify-center gap-1 whitespace-nowrap rounded-full bg-brand-soft px-3 py-1.5 text-xs leading-none font-black font-display text-brand">
          <Flame size={14} />
          {project.matchPercent}% Skill Match
        </span>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex gap-6 text-base">
          <div>
            <p className="text-ink-muted font-body text-xs">Budget</p>
            <p className="mt-0.5 font-black font-display text-sm text-ink">{project.budgetLabel}</p>
          </div>
          <div>
            <p className="text-ink-muted font-body text-xs">
              Deadline
            </p>
            <p className="mt-0.5 font-black font-display text-sm text-ink">{project.deadlineLabel}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-canvas px-2.5 py-1 text-xs text-ink font-body"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-start gap-3">
        <Link
          href="/dashboard/find-projects"
          className="inline-flex h-10 w-full sm:w-auto items-center justify-center rounded-full border-2 border-ink px-6 text-xs sm:text-sm font-semibold text-ink transition-colors hover:border-brand hover:text-brand"
        >
          LIHAT PROJECT
        </Link>
        <span className="text-xs sm:text-sm text-ink-muted">{project.postedLabel}</span>
      </div>
    </div>
  );
}
