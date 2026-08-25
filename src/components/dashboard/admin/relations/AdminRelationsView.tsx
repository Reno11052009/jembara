import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import RelationsFilterTabs from "@/components/dashboard/admin/relations/RelationsFilterTabs";
import RelationsTableCard from "@/components/dashboard/admin/relations/RelationsTableCard";
import { adminName } from "@/lib/mock-admin-dashboard";
import { adminRelationRows } from "@/lib/mock-admin-relations";

export default function AdminRelationsView() {
  return (
    <>
      <PageHeader
        title="Relasi UMKM & Talent"
        subtitle="Pantau keterikatan kontrak kerja, progress, dan hasil kolaborasi."
        userName={adminName}
      />

      <div className="flex flex-col gap-6">
        <RelationsFilterTabs />
        <RelationsTableCard rows={adminRelationRows} />
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
