import PageHeader from "@/components/layout/PageHeader";
import UserListToolbar from "@/components/dashboard/admin/users/UserListToolbar";
import UserListTable from "@/components/dashboard/admin/users/UserListTable";
import AdminPagination from "@/components/dashboard/admin/AdminPagination";
import type { AdminUsersData } from "@/types/admin-users";

export default function AdminUserListView({ data }: { data: AdminUsersData }) {
  return (
    <>
      <PageHeader
        title="Daftar User"
        subtitle="Manajemen seluruh talenta / mahasiswa yang terdaftar di Jembara."
        userName={data.adminName}
        avatarUrl={data.adminAvatarUrl}
      />

      <div className="flex flex-col gap-6">
        <UserListToolbar filters={data.filters} skillOptions={data.skillOptions} />
        <UserListTable users={data.users} />
        <AdminPagination
          basePath="/dashboard/daftar-user"
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          summary={data.summary}
          preservedParams={{
            q: data.filters.query,
            availability: data.filters.availability,
            skill: data.filters.skill,
          }}
        />
      </div>
    </>
  );
}
