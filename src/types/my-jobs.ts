export type ProjectWorkMode = "REMOTE" | "HYBRID" | "ONSITE";

export type JobListingStatus =
  | "Terbuka"
  | "Seleksi"
  | "Menunggu Pembayaran"
  | "Berjalan"
  | "Dalam Review"
  | "Selesai"
  | "Dibatalkan"
  | "Lainnya";

export interface ProjectSkillOption {
  id: string;
  name: string;
  category: string;
}

export interface ProjectCreationData {
  ownerName: string;
  ownerAvatarUrl: string;
  businessName: string;
  skillOptions: ProjectSkillOption[];
}

export interface MyJobListing {
  id: string;
  title: string;
  description: string;
  postedDateLabel: string;
  applicantCount: number;
  budgetLabel: string;
  deadlineLabel: string;
  workModeLabel: string;
  locationLabel: string;
  skills: string[];
  status: JobListingStatus;
  statusCode: string;
  paymentStatus: string | null;
  hasSelectedStudent: boolean;
}

export interface MyJobsData {
  ownerName: string;
  ownerAvatarUrl: string;
  businessName: string;
  listings: MyJobListing[];
}
