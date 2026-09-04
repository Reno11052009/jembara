import PasangLowonganView from "@/components/dashboard/umkm/pasang-lowongan/PasangLowonganView";
import { getProjectCreationData } from "@/lib/my-jobs";

export const instant = false;

export default async function PasangLowonganPage() {
  const data = await getProjectCreationData();
  return <PasangLowonganView data={data} />;
}
