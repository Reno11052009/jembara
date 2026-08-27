import AdminRelationsView from "@/components/dashboard/admin/relations/AdminRelationsView";
import { getAdminRelationsData, type AdminSearchParams } from "@/lib/admin";

export default async function RelasiPage({
  searchParams,
}: {
  searchParams: Promise<AdminSearchParams>;
}) {
  const data = await getAdminRelationsData(await searchParams);
  return <AdminRelationsView data={data} />;
}
