import UmkmListTableHeader from "@/components/dashboard/admin/umkm/UmkmListTableHeader";
import UmkmListRow from "@/components/dashboard/admin/umkm/UmkmListRow";
import type { AdminUmkmRow } from "@/types/admin-umkm";

export default function UmkmListTable({ rows }: { rows: AdminUmkmRow[] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-hairline bg-card">
      <div className="min-w-[1100px]"><UmkmListTableHeader /><div className="divide-y divide-hairline">{rows.length > 0 ? rows.map((row) => <UmkmListRow key={row.id} umkm={row} />) : <p className="px-6 py-12 text-center text-sm text-ink-muted">Tidak ada UMKM yang sesuai dengan filter.</p>}</div></div>
    </div>
  );
}
