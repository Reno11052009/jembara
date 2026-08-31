import type { AdminUmkmRow } from "@/types/admin-umkm";
import { UMKM_ROW_GRID } from "@/components/dashboard/admin/umkm/UmkmListTableHeader";

function getInitials(name: string) { return name.split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }

export default function UmkmListRow({ umkm }: { umkm: AdminUmkmRow }) {
  const isComplete = umkm.profileStatus === "lengkap";
  return (
    <div className={`${UMKM_ROW_GRID} px-6 py-4`}>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-black text-brand">{getInitials(umkm.ownerName)}</span>
      <div><p className="font-display text-sm font-bold text-ink">{umkm.ownerName}</p><p className="text-xs text-ink-muted">{umkm.businessName}</p><p className="text-xs text-ink-muted">{umkm.email}</p></div>
      <span className="text-sm text-ink">{umkm.category}</span>
      <span className="text-sm text-ink-muted">{umkm.location}</span>
      <span className="text-sm font-bold text-ink">{umkm.jobCount} Lowongan</span>
      <span className={`inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-semibold ${isComplete ? "bg-success/10 text-success" : "bg-brand-soft text-brand"}`}>{isComplete ? "Profil lengkap" : "Perlu dilengkapi"}</span>
      <span className="text-sm text-ink-muted">{umkm.registeredDate}</span>
    </div>
  );
}
