import MyJobsView from "@/components/dashboard/umkm/my-job/MyJobsView";
import { getMyJobsData } from "@/lib/my-jobs";

export default async function LowonganSayaPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[]; status?: string | string[] }>;
}) {
  const data = await getMyJobsData(await searchParams);
  return <MyJobsView data={data} />;
}
