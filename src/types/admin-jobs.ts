export type JobListingStatus = "aktif" | "terlaporkan";

export interface AdminJobRow {
  id: string;
  title: string;
  ownerBusinessName: string;
  category: string;
  budgetLabel: string;
  applicantCount: number;
  status: JobListingStatus;
  flagged?: boolean;
}
