import { LucideIcon } from "lucide-react";

export type ProposalStatus = "Pending" | "Accepted" | "Rejected";

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