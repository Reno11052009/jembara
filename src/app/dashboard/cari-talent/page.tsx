import CariTalentView from "@/components/dashboard/umkm/cari-talents/CariTalentView";
import { getTalentSearchData } from "@/lib/talents";

export default async function CariTalentPage({
  searchParams,
}: {
  searchParams: Promise<{ project?: string | string[] }>;
}) {
  const rawProjectId = (await searchParams).project;
  const projectId = Array.isArray(rawProjectId) ? rawProjectId[0] : rawProjectId;
  const data = await getTalentSearchData(projectId);

  return <CariTalentView data={data} />;
}
