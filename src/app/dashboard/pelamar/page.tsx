import PelamarView from "@/components/dashboard/umkm/pelamar/PelamarView";
import { getApplicantsData } from "@/lib/applicants";

export default async function PelamarPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string | string[]; page?: string | string[]; status?: string | string[] }>;
}) {
  const query = await searchParams;
  const rawProjectId = query.project;
  const projectId = Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId;
  const data = await getApplicantsData(projectId, query);
  return <PelamarView data={data} />;
}
