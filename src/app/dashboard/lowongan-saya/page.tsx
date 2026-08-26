import MyJobsView from "@/components/dashboard/umkm/my-job/MyJobsView";
import { getMyJobsData } from "@/lib/my-jobs";

export default async function LowonganSayaPage() {
  const data = await getMyJobsData();
  return <MyJobsView data={data} />;
}
