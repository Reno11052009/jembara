import JobsTableHeader from "@/components/dashboard/admin/jobs/JobsTableHeader";
import JobsTableRow from "@/components/dashboard/admin/jobs/JobsTableRow";
import { AdminJobRow } from "@/types/admin-jobs";

export default function JobsTable({ rows }: { rows: AdminJobRow[] }) {
  return (
    <div className="overflow-hidden rounded-xl border border-hairline bg-card">
      <JobsTableHeader />
      <div className="divide-y divide-hairline">
        {rows.map((row) => (
          <JobsTableRow key={row.id} job={row} />
        ))}
      </div>
    </div>
  );
}
