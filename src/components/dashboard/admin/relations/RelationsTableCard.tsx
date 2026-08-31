import RelationsTableHeader from "@/components/dashboard/admin/relations/RelationsTableHeader";
import RelationsTableRow from "@/components/dashboard/admin/relations/RelationsTableRow";
import type { AdminRelationRow } from "@/types/admin-relations";

export default function RelationsTableCard({ rows }: { rows: AdminRelationRow[] }) {
  return <div className="overflow-x-auto rounded-xl border border-hairline bg-card"><div className="min-w-[1000px]"><RelationsTableHeader /><div className="divide-y divide-hairline">{rows.length > 0 ? rows.map((row) => <RelationsTableRow key={row.id} row={row} />) : <p className="px-6 py-12 text-center text-sm text-ink-muted">Belum ada relasi proyek pada status ini.</p>}</div></div></div>;
}
