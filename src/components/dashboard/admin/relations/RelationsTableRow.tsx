import type { AdminRelationRow } from "@/types/admin-relations";
import { RELATION_ROW_GRID } from "@/components/dashboard/admin/relations/RelationsTableHeader";

const statusStyles: Record<AdminRelationRow["status"], string> = { aktif: "bg-brand-soft text-brand", review: "bg-amber-50 text-amber-700", selesai: "bg-success/10 text-success", dibatalkan: "bg-danger-soft text-danger" };
const statusLabels: Record<AdminRelationRow["status"], string> = { aktif: "Berlangsung", review: "Dalam review", selesai: "Selesai", dibatalkan: "Dibatalkan" };

export default function RelationsTableRow({ row }: { row: AdminRelationRow }) {
  return <div className={`${RELATION_ROW_GRID} px-6 py-4`}><div><p className="font-display text-sm font-bold text-ink">{row.umkmOwnerName}</p><p className="text-xs text-ink-muted">{row.umkmBusinessName}</p></div><div><p className="font-display text-sm font-bold text-ink">{row.talentName}</p><p className="text-xs text-ink-muted">{row.talentInstitution}</p></div><span className="text-sm font-semibold text-ink">{row.projectName}</span><span className="text-sm font-bold text-brand">{row.contractValue}</span><span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[row.status]}`}>{statusLabels[row.status]}</span><span className="text-sm font-bold text-ink">{row.rating ? `${row.rating.toFixed(1)} ★` : "—"}</span></div>;
}
