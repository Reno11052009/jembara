"use client";

import { useRouter } from "next/navigation";
import type { Proposal, ProposalFilter } from "@/types/proposal";
import ProposalFilterTabs from "@/components/proposals/ProposalFilterTabs";
import ProposalList from "@/components/proposals/ProposalList";
import ListPagination from "@/components/ui/ListPagination";
import type { PaginationData } from "@/types/pagination";

interface ProposalsViewProps {
  proposals: Proposal[];
  tabCounts: Record<ProposalFilter, number>;
  activeFilter: ProposalFilter;
  pagination: PaginationData;
}

export default function ProposalsView({ proposals, tabCounts, activeFilter, pagination }: ProposalsViewProps) {
  const router = useRouter();
  const setActiveFilter = (filter: ProposalFilter) => {
    const params = new URLSearchParams();
    if (filter !== "Semua") params.set("status", filter);
    const query = params.toString();
    router.replace(query ? `/dashboard/proposals?${query}` : "/dashboard/proposals");
  };

  return (
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
  );
}
