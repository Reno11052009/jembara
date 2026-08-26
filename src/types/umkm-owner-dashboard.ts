export interface OwnerJobListing {
  id: string;
  title: string;
  companyName: string;
  matchPercent: number;
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
}
