import PageHeader from "@/components/layout/PageHeader";
import RelationsFilterTabs from "@/components/dashboard/admin/relations/RelationsFilterTabs";
import RelationsTableCard from "@/components/dashboard/admin/relations/RelationsTableCard";
import type { AdminRelationsData } from "@/types/admin-relations";

export default function AdminRelationsView({ data }: { data: AdminRelationsData }) {
  return (
    <>
      <PageHeader title="Relasi UMKM & Talent" subtitle="Pantau keterikatan proyek, status, dan hasil kolaborasi." userName={data.adminName} avatarUrl={data.adminAvatarUrl} />
      <div className="flex flex-col gap-6"><RelationsFilterTabs active={data.activeFilter} /><RelationsTableCard rows={data.rows} /></div>
    </>
  );
}
