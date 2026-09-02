import { BriefcaseBusiness, CalendarDays, FileText } from "lucide-react";
import type { ManagedProject } from "@/types/dashboard";

const statusPresentation: Record<string, { label: string; className: string }> = {
  OPEN: { label: "Open", className: "bg-blue-50 dark:bg-blue-500/15 text-blue-700 dark:text-blue-400" },
  PROPOSAL: { label: "Seleksi Proposal", className: "bg-violet-50 dark:bg-violet-500/15 text-violet-700 dark:text-violet-400" },
  IN_PROGRESS: { label: "In Progress", className: "bg-brand-soft text-brand" },
  REVIEW: { label: "In Review", className: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400" },
  COMPLETED: { label: "Completed", className: "bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400" },
  CANCELLED: { label: "Cancelled", className: "bg-red-50 dark:bg-red-500/15 text-red-700 dark:text-red-400" },
};

export default function ManagedProjectCard({ project }: { project: ManagedProject }) {
  const status = statusPresentation[project.status] ?? {
    label: project.status,
    className: "bg-gray-100 dark:bg-surface text-gray-700 dark:text-ink-muted",
  };

  return (
    <article className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-black text-ink">{project.title}</h3>
          <p className="mt-1 text-sm text-ink-muted">{project.companyName}</p>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-bold ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="mt-4 grid gap-3 text-sm text-ink-muted sm:grid-cols-3">
        <span className="flex items-center gap-2">
          <BriefcaseBusiness size={15} className="text-brand" />
          {project.budgetLabel}
        </span>
        <span className="flex items-center gap-2">
          <CalendarDays size={15} className="text-brand" />
          {project.deadlineLabel}
        </span>
        <span className="flex items-center gap-2">
          <FileText size={15} className="text-brand" />
          {project.proposalCount} proposal
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="rounded-md bg-canvas px-2.5 py-1 text-xs text-ink">
            {tag}
          </span>
        ))}
        {project.tags.length === 0 && (
          <span className="text-xs text-ink-muted">Belum ada skill yang ditentukan.</span>
        )}
      </div>

      {project.selectedStudentName && (
        <p className="mt-4 text-xs text-ink-muted">
          Talent terpilih: <span className="font-bold text-ink">{project.selectedStudentName}</span>
        </p>
      )}
    </article>
  );
}
