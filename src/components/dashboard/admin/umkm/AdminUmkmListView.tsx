import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import UmkmListToolbar from "@/components/dashboard/admin/umkm/UmkmListToolbar";
import UmkmListTable from "@/components/dashboard/admin/umkm/UmkmListTable";
import { adminName } from "@/lib/mock-admin-dashboard";
import { adminUmkmRows } from "@/lib/mock-admin-umkm";

export default function AdminUmkmListView() {
  return (
    <>
      <PageHeader
        title="Daftar Pemilik UMKM"
        subtitle="Verifikasi dan awasi pelaku usaha mikro, kecil, dan menengah se-Indonesia."
        userName={adminName}
      />

      <div className="flex flex-col gap-6">
        <UmkmListToolbar />
        <UmkmListTable rows={adminUmkmRows} />
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
