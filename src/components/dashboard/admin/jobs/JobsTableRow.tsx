import { AlertTriangle } from "lucide-react";
import Button from "@/components/ui/Button";
import { AdminJobRow } from "@/types/admin-jobs";
import { JOB_ROW_GRID } from "@/components/dashboard/admin/jobs/JobsTableHeader";

export default function JobsTableRow({ job }: { job: AdminJobRow }) {
  const isFlagged = job.status === "terlaporkan";

  return (
    <div className={`${JOB_ROW_GRID} px-6 py-4 ${isFlagged ? "bg-danger-soft/30" : ""}`}>
      <div className="flex items-center gap-1.5 overflow-hidden">
        {job.flagged && (
          <AlertTriangle size={14} className="shrink-0 text-brand" />
        )}
        <span className="truncate font-display text-sm font-bold text-ink" title={job.title}>
          {job.title}
        </span>
      </div>

      <span className="text-sm text-ink">{job.ownerBusinessName}</span>

      <span className="text-sm text-ink-muted">{job.category}</span>

      <span className="text-sm font-bold text-brand">{job.budgetLabel}</span>

      <span className="text-sm text-ink">{job.applicantCount} Orang</span>

      {isFlagged ? (
        <Button variant="danger-outline" size="sm" className="w-fit">
          Terlaporkan
        </Button>
      ) : (
        <span className="inline-flex w-fit items-center rounded-full bg-success/10 px-3 py-1 text-xs font-semibold text-success">
          Aktif
        </span>
      )}

      <div className="flex items-center gap-2 justify-self-end">
        {isFlagged ? (
          <Button variant="danger" size="sm">
            Block
          </Button>
        ) : (
          <>
            <Button variant="outline" size="sm">
              Lihat
            </Button>
            <Button variant="danger-soft" size="sm">
              Takedown
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
