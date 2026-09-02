import Link from "next/link";
import type { AdminJobRow } from "@/types/admin-jobs";
import { JOB_ROW_GRID } from "@/components/dashboard/admin/jobs/JobsTableHeader";

const statusLabels: Record<AdminJobRow["status"], string> = { OPEN: "Terbuka", PROPOSAL: "Seleksi", IN_PROGRESS: "Berjalan", REVIEW: "Dalam review", COMPLETED: "Selesai", CANCELLED: "Dibatalkan", UNKNOWN: "Tidak diketahui" };
const statusStyles: Record<AdminJobRow["status"], string> = { OPEN: "bg-success/10 text-success", PROPOSAL: "bg-brand-soft text-brand", IN_PROGRESS: "bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400", REVIEW: "bg-amber-50 dark:bg-amber-500/15 text-amber-700 dark:text-amber-400", COMPLETED: "bg-success/10 text-success", CANCELLED: "bg-danger-soft text-danger", UNKNOWN: "bg-canvas text-ink-muted" };

export default function JobsTableRow({ job }: { job: AdminJobRow }) {
  return (
    <div className={`${JOB_ROW_GRID} px-6 py-4`}>
      <span className="truncate font-display text-sm font-bold text-ink" title={job.title}>{job.title}</span>
      <span className="text-sm text-ink">{job.ownerBusinessName}</span>
      <span className="text-sm text-ink-muted">{job.category}</span>
      <span className="text-sm font-bold text-brand">{job.budgetLabel}</span>
      <span className="text-sm text-ink">{job.applicantCount} Orang</span>
      <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[job.status]}`}>{statusLabels[job.status]}</span>
      <Link href={`/dashboard/find-projects/${job.id}`} className="justify-self-end rounded-full border border-ink px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:border-brand hover:text-brand">Lihat</Link>
    </div>
  );
}
