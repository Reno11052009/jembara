export type AdminUmkmVerificationStatus = "terverifikasi" | "pending" | "ditolak";

export interface AdminUmkmRow {
  id: string;
  ownerName: string;
  businessName: string;
  email: string;
  category: string;
  location: string;
  jobCount: number;
  verification: AdminUmkmVerificationStatus;
  rejectionReason?: string;
  registeredDate: string;
}
