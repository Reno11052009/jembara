import AdminUmkmListView from "@/components/dashboard/admin/umkm/AdminUmkmListView";
import { getAdminUmkmData, type AdminSearchParams } from "@/lib/admin";

export default async function DaftarUmkmPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const data = await getAdminUmkmData(await searchParams);
  return <AdminUmkmListView data={data} />;
}
