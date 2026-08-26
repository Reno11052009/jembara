export type ApplicantStatus = "Pending" | "Diterima" | "Ditolak";

export interface Applicant {
  id: string;
  name: string;
  rating: number | null;
  reviewCount: number;
  location: string;
  isRemote?: boolean;
  appliedAtLabel: string;
  matchPercent: number;
  proposal: string;
  skills: string[];
  status: ApplicantStatus;
  budgetMatch: boolean | null;
  portfolioUrl: string | null;
}

export interface ApplicantProjectOption {
  id: string;
  title: string;
  status: string;
}

export interface ApplicantsData {
  ownerName: string;
  ownerAvatarUrl: string;
  projects: ApplicantProjectOption[];
  selectedProjectId: string | null;
  selectedProjectTitle: string | null;
  applicants: Applicant[];
}
