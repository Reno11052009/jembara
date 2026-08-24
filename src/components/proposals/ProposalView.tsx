"use client";

import { useState } from "react";
import type { Proposal, ProposalFilter } from "@/types/proposal";
import ProposalFilterTabs from "@/components/proposals/ProposalFilterTabs";
import ProposalList from "@/components/proposals/ProposalList";

interface ProposalsViewProps {
  proposals: Proposal[];
  tabCounts: Record<ProposalFilter, number>;
}

export default function ProposalsView({ proposals, tabCounts }: ProposalsViewProps) {
  const [activeFilter, setActiveFilter] = useState<ProposalFilter>("Semua");

  const filteredProposals =
    activeFilter === "Semua"
      ? proposals
      : proposals.filter((proposal) => proposal.status === activeFilter);

  return (
    <div className="flex flex-col gap-5">
      <ProposalFilterTabs
        active={activeFilter}
        counts={tabCounts}
        onChange={setActiveFilter}
      />
      <ProposalList proposals={filteredProposals} />
    </div>
  );
}
