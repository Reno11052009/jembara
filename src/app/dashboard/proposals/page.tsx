import ProposalsView from "@/components/proposals/ProposalView";
import { getStudentProposals } from "@/lib/proposals";

export const instant = false;

export default async function ProposalsPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[]; status?: string | string[] }>;
}) {
  const data = await getStudentProposals(await searchParams);

  return (
    <ProposalsView
      summary={data.summary}
      proposals={data.proposals}
      tabCounts={data.tabCounts}
      activeFilter={data.activeFilter}
      pagination={data.pagination}
    />
  );
}
