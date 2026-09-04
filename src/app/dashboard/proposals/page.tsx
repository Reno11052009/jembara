import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import ProposalStatsGrid from "@/components/proposals/ProposalStatsGrid";
import ProposalsView from "@/components/proposals/ProposalView";
import { getStudentProposals } from "@/lib/proposals";

export const instant = false;

export default async function ProposalsPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[]; status?: string | string[] }>;
}) {
  const data = await getStudentProposals(await searchParams);

  return (
    <>
      <DashboardPageHeader
        title="My Proposals"
        subtitle="Kelola dan pantau status pengajuan proposal project Anda."
      />

      <div className="flex flex-col gap-6">
        <ProposalStatsGrid summary={data.summary} />
        <ProposalsView proposals={data.proposals} tabCounts={data.tabCounts} activeFilter={data.activeFilter} pagination={data.pagination} />
      </div>
    </>
  );
}
