"use client";

import { Proposal } from "@/types/proposal";
import ProposalCard from "@/components/proposals/ProposalCard";
import { usePreferences } from "@/contexts/PreferencesContext";

interface ProposalListProps {
  proposals: Proposal[];
}

export default function ProposalList({ proposals }: ProposalListProps) {
  const { dict } = usePreferences();

  if (proposals.length === 0) {
    return (
      <div className="rounded-xl border border-hairline bg-card p-8 text-center text-sm text-ink-muted">
        {dict.proposals.emptyCategory || "Belum ada proposal di kategori ini."}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {proposals.map((proposal) => (
        <ProposalCard key={proposal.id} proposal={proposal} />
      ))}
    </div>
  );
}