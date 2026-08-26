import PageHeader from "@/components/layout/PageHeader";
import Footer from "@/components/landing/Footer";
import UserListToolbar from "@/components/dashboard/admin/users/UserListToolbar";
import UserListTable from "@/components/dashboard/admin/users/UserListTable";
import UserListPagination from "@/components/dashboard/admin/users/UserListPagination";
import { adminName } from "@/lib/mock-admin-dashboard";
import { adminUserListSummary, adminUserRows } from "@/lib/mock-admin-users";

export default function AdminUserListView() {
  return (
    <>
      <PageHeader
        title="Daftar User"
        subtitle="Manajemen seluruh talenta / mahasiswa yang terdaftar di Jembatan Karya."
        userName={adminName}
      />

      <div className="flex flex-col gap-6">
        <UserListToolbar />
        <UserListTable users={adminUserRows} />
        <UserListPagination summary={adminUserListSummary} />
      </div>

      <div className="-mx-6 mt-10 sm:-mx-8">
        <Footer />
      </div>
    </>
  );
}
