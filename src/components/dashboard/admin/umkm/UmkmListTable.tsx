import UmkmListTableHeader from "@/components/dashboard/admin/umkm/UmkmListTableHeader";
import UmkmListRow from "@/components/dashboard/admin/umkm/UmkmListRow";
import { AdminUmkmRow } from "@/types/admin-umkm";

export default function UmkmListTable({ rows }: { rows: AdminUmkmRow[] }) {
  return (
    <div className="rounded-xl border border-hairline bg-card">
      <UmkmListTableHeader />
      <div className="divide-y divide-hairline">
        {rows.map((row) => (
          <UmkmListRow key={row.id} umkm={row} />
        ))}
      </div>
    </div>
  );
}
