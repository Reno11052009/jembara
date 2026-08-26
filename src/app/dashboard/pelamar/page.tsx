import PelamarView from "@/components/dashboard/umkm/pelamar/PelamarView";
import { getApplicantsData } from "@/lib/applicants";

export default async function PelamarPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string | string[] }>;
}) {
  const rawProjectId = (await searchParams).project;
  const projectId = Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId;
  const data = await getApplicantsData(projectId);
  return <PelamarView data={data} />;
}
