export type JobListingStatus = "Aktif" | "Ditutup" | "Draft";

export interface MyJobListing {
  id: string;
  title: string;
  postedDateLabel: string;
  applicantCount: number;
  budgetLabel: string;
  status: JobListingStatus;
}
