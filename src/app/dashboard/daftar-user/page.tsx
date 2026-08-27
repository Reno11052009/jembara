import AdminUserListView from "@/components/dashboard/admin/users/AdminUserListView";
import { getAdminUsersData, type AdminSearchParams } from "@/lib/admin";

export default async function DaftarUserPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const data = await getAdminUsersData(await searchParams);
  return <AdminUserListView data={data} />;
}
