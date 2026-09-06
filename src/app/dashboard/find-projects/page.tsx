import { Suspense } from "react";
import DashboardRouteSkeleton from "@/components/layout/DashboardRouteSkeleton";
import FindProjectsView from "@/components/projects/FindProjectsView";
import {
  getFindProjectsData,
  type FindProjectsSearchParams,
} from "@/lib/find-projects";

async function FindProjectsContent({
  searchParams,
}: {
  searchParams: Promise<FindProjectsSearchParams>;
}) {
  const data = await getFindProjectsData(await searchParams);

  return <FindProjectsView data={data} />;
}

export default function FindProjectsPage({
  searchParams,
}: {
  searchParams: Promise<FindProjectsSearchParams>;
}) {
  return (
    <Suspense fallback={<DashboardRouteSkeleton />}>
      <FindProjectsContent searchParams={searchParams} />
    </Suspense>
  );
}
