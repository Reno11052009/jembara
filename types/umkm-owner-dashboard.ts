export interface OwnerJobListing {
  id: string;
  title: string;
  companyName: string;
  matchPercent?: number;
  budgetLabel?: string;
  applicantCount: number;
  status: "Aktif" | "Ditutup";
}

export interface OwnerRecentApplicant {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  matchPercent: number;
  appliedAtLabel: string;
  projectTitle?: string;
}

export interface OwnerStatData {
  id: string;
  label: string;
  value: string;
}

export interface OwnerDashboardOverview {
  businessName: string;
  stats: OwnerStatData[];
  recentJobListings: OwnerJobListing[];
  recentApplicants: OwnerRecentApplicant[];
}
