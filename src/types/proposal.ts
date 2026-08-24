export type ProposalStatus = "Pending" | "Accepted" | "Rejected";
export type ProposalFilter = "Semua" | ProposalStatus;

export interface Proposal {
  id: string;
  title: string;
  clientName: string;
  description: string;
  matchPercent: number;
  status: ProposalStatus;
  tags: string[];
  budgetLabel: string;
  submittedLabel: string;
}

export interface ProposalSummary {
  total: number;
  pending: number;
  accepted: number;
  rejected: number;
}

export interface ProposalsData {
  proposals: Proposal[];
  summary: ProposalSummary;
  tabCounts: Record<ProposalFilter, number>;
}
