import { Flame } from "lucide-react";
import { RecommendedProject } from "@/types/dashboard";
import Button from "@/components/ui/Button";

interface RecommendedProjectCardProps {
  project: RecommendedProject;
}

export default function RecommendedProjectCard({
  project,
}: RecommendedProjectCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-black text-ink">
            {project.title}
          </h3>
          <p className="mt-1 text-sm font-body text-ink-muted">{project.companyName}</p>
        </div>
        <span className="flex shrink-0 items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-sm font-semibold text-brand">
          <Flame size={16} />
          {project.matchPercent}% Match
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-ink-muted font-body">Budget</p>
            <p className="mt-0.5 font-black font-display text-sm text-ink">{project.budgetLabel}</p>
          </div>
          <div>
            <p className="text-ink-muted font-body">
              Deadline
            </p>
            <p className="mt-0.5 font-black font-display text-sm text-ink">{project.deadlineLabel}</p>
          </div>
        </div>
        <div className="flex gap-2">
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

      <div className="mt-4 flex items-center justify-between gap-3">
        <Button variant="outline">LAMAR PROJECT</Button>
        <span className="text-sm text-ink-muted">{project.postedLabel}</span>
      </div>
    </div>
  );
}
