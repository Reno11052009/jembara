export type AdminUserStatus = "aktif" | "nonaktif";

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  skill: string;
  rating: number;
  status: AdminUserStatus;
  joinedDate: string;
}
