export type AdminUserAvailability = "tersedia" | "tidak_tersedia";

export interface AdminFilterOption {
  label: string;
  value: string;
}

export interface AdminUserRow {
  id: string;
  name: string;
  email: string;
  skill: string;
  rating: number | null;
  availability: AdminUserAvailability;
  joinedDate: string;
}

export interface AdminUsersData {
  adminName: string;
  adminAvatarUrl?: string;
  users: AdminUserRow[];
  summary: string;
  skillOptions: AdminFilterOption[];
  filters: { query: string; availability: string; skill: string };
  currentPage: number;
  totalPages: number;
}
