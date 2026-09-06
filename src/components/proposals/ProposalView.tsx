"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { Proposal, ProposalFilter, ProposalSummary } from "@/types/proposal";
import ProposalFilterTabs from "@/components/proposals/ProposalFilterTabs";
import ProposalList from "@/components/proposals/ProposalList";
import ListPagination from "@/components/ui/ListPagination";
import type { PaginationData } from "@/types/pagination";

import ProposalStatsGrid from "@/components/proposals/ProposalStatsGrid";

interface ProposalsViewProps {
  summary: ProposalSummary;
  proposals: Proposal[];
  tabCounts: Record<ProposalFilter, number>;
  activeFilter: ProposalFilter;
  pagination: PaginationData;
}

export default function ProposalsView({ summary, proposals, tabCounts, activeFilter, pagination }: ProposalsViewProps) {
  const router = useRouter();
  const { dict } = usePreferences();

  const setActiveFilter = (filter: ProposalFilter) => {
    const params = new URLSearchParams();
    if (filter !== "Semua") params.set("status", filter);
    const query = params.toString();
    router.replace(query ? `/dashboard/proposals?${query}` : "/dashboard/proposals");
  };

  return (
    <>
      <PageHeader
        title={dict.proposals.title}
        subtitle={dict.proposals.subtitle}
      />
      <div className="flex flex-col gap-6">
        <ProposalStatsGrid summary={summary} />
        <div className="flex flex-col gap-5">
          <ProposalFilterTabs
            active={activeFilter}
            counts={tabCounts}
            onChange={setActiveFilter}
          />
          <ProposalList proposals={proposals} />
          <ListPagination
            basePath="/dashboard/proposals"
            pagination={pagination}
            preservedParams={{ status: activeFilter === "Semua" ? null : activeFilter }}
          />
        </div>
      </div>
    </>
  );
}
