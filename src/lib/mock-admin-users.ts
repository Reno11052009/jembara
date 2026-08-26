import type { AdminUserRow } from "@/types/admin-users";

export const adminUserStatusOptions = [
  { label: "Aktif", value: "aktif" },
  { label: "Nonaktif", value: "nonaktif" },
];

export const adminUserSkillOptions = [
  { label: "UI/UX Design", value: "ui-ux-design" },
  { label: "Web Development", value: "web-development" },
  { label: "Graphic Design", value: "graphic-design" },
];

export const adminUserRows: AdminUserRow[] = [
  {
    id: "1",
    name: "Chello Saputra",
    email: "chello@student.ui.ac.id",
    skill: "UI/UX Design",
    rating: 4.9,
    status: "aktif",
    joinedDate: "12 Jan 2026",
  },
  {
    id: "2",
    name: "Maya Amelia",
    email: "maya.amelia@mail.com",
    skill: "Web Development",
    rating: 4.8,
    status: "aktif",
    joinedDate: "03 Jan 2026",
  },
  {
    id: "3",
    name: "Rian Hidayat",
    email: "rian.hidayat@gmail.com",
    skill: "Graphic Design",
    rating: 3.5,
    status: "nonaktif",
    joinedDate: "28 Des 2025",
  },
  {
    id: "4",
    name: "Rian Hidayat",
    email: "rian.hidayat@gmail.com",
    skill: "Graphic Design",
    rating: 3.5,
    status: "nonaktif",
    joinedDate: "28 Des 2025",
  },
  {
    id: "5",
    name: "Rian Hidayat",
    email: "rian.hidayat@gmail.com",
    skill: "Graphic Design",
    rating: 3.5,
    status: "nonaktif",
    joinedDate: "28 Des 2025",
  },
  {
    id: "6",
    name: "Rian Hidayat",
    email: "rian.hidayat@gmail.com",
    skill: "Graphic Design",
    rating: 3.5,
    status: "nonaktif",
    joinedDate: "28 Des 2025",
  },
  {
    id: "7",
    name: "Rian Hidayat",
    email: "rian.hidayat@gmail.com",
    skill: "Graphic Design",
    rating: 3.5,
    status: "nonaktif",
    joinedDate: "28 Des 2025",
  },
];

export const adminUserListSummary = "Menampilkan 1-3 dari 12,480 Talenta";
