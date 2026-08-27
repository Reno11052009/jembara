import type { AdminStatData } from "./admin-dashboard";

export type AdminJobStatus =
  | "OPEN"
  | "PROPOSAL"
  | "IN_PROGRESS"
  | "REVIEW"
  | "COMPLETED"
  | "CANCELLED"
  | "UNKNOWN";

export interface AdminJobRow {
  id: string;
  title: string;
  ownerBusinessName: string;
  category: string;
  budgetLabel: string;
  applicantCount: number;
  status: AdminJobStatus;
}

export interface AdminJobsData {
  adminName: string;
  adminAvatarUrl?: string;
  stats: AdminStatData[];
  rows: AdminJobRow[];
}
