import type { AdminFilterOption } from "./admin-users";

export type AdminUmkmProfileStatus = "lengkap" | "perlu_dilengkapi";

export interface AdminUmkmRow {
  id: string;
  ownerName: string;
  businessName: string;
  email: string;
  category: string;
  location: string;
  jobCount: number;
  profileStatus: AdminUmkmProfileStatus;
  registeredDate: string;
}

export interface AdminUmkmData {
  adminName: string;
  adminAvatarUrl?: string;
  rows: AdminUmkmRow[];
  summary: string;
  statusOptions: AdminFilterOption[];
  filters: { query: string; profileStatus: string };
  currentPage: number;
  totalPages: number;
}
