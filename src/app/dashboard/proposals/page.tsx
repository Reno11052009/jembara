import PageHeader from "@/components/layout/PageHeader";
import ProposalStatsGrid from "@/components/proposals/ProposalStatsGrid";
import ProposalsView from "@/components/proposals/ProposalView";
import { proposalStats, proposalTabCounts, proposals } from "@/lib/mock-proposal";

export default function ProposalsPage() {
  return (
    <>
      <PageHeader
        title="My Proposals"
        subtitle="Kelola dan pantau status pengajuan proposal project Anda."
      />

      <div className="flex flex-col gap-6">
        <ProposalStatsGrid stats={proposalStats} />
        <ProposalsView proposals={proposals} tabCounts={proposalTabCounts} />
      </div>
    </>
  );
}