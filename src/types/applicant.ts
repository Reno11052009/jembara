export type ApplicantStatus = "Baru" | "Shortlist" | "Ditolak";

export interface Applicant {
  id: string;
  name: string;
  rating: number;
  location: string;
  isRemote?: boolean;
  appliedAtLabel: string;
  matchPercent: number;
  proposal: string;
  skills: string[];
  status: ApplicantStatus;
}
