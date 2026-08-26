import RelationsTableHeader from "@/components/dashboard/admin/relations/RelationsTableHeader";
import RelationsTableRow from "@/components/dashboard/admin/relations/RelationsTableRow";
import RelationsTimeline from "@/components/dashboard/admin/relations/RelationsTimeline";
import { AdminRelationRow } from "@/types/admin-relations";

export default function RelationsTableCard({ rows }: { rows: AdminRelationRow[] }) {
  const rowWithTimeline = rows.find((row) => row.timeline && row.timeline.length > 0);

  return (
    <div className="rounded-xl border border-hairline bg-card">
      <RelationsTableHeader />
      <div className="divide-y divide-hairline">
        {rows.map((row) => (
          <RelationsTableRow key={row.id} row={row} />
        ))}
      </div>

      {rowWithTimeline?.timeline && (
        <div className="border-t border-hairline">
          <RelationsTimeline
            projectName={rowWithTimeline.projectName}
            steps={rowWithTimeline.timeline}
          />
        </div>
      )}
    </div>
  );
}
