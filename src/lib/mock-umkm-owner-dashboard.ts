import { FileText, Users, Briefcase, Wallet } from "lucide-react";
import type { DashboardStat } from "@/types/dashboard";
import type { OwnerJobListing, OwnerRecentApplicant } from "@/types/umkm-owner-dashboard";

// NOTE: this dashboard is not wired to getDashboardData()/Prisma — the mockup's
// "Lowongan" / "Pelamar" concepts don't exist in the current schema (which only
// has Project/Proposal). All data below is placeholder until that's decided.

export const ownerName = "Pak Chello";
export const businessName = "Java Woodcraft";
export const ownerAvatarUrl = "https://ui-avatars.com/api/?name=Chello&background=random";

export const ownerStats: DashboardStat[] = [
  { id: "lowongan-aktif", label: "Lowongan Aktif", value: "4 Lowongan", icon: FileText },
  { id: "total-pelamar", label: "Total Pelamar", value: "28 Orang", icon: Users },
  { id: "proyek-berjalan", label: "Proyek Berjalan", value: "3 Proyek", icon: Briefcase },
  { id: "total-pengeluaran", label: "Total Pengeluaran", value: "Rp 12.8M", icon: Wallet },
];

export const recentJobListings: OwnerJobListing[] = [
  {
    id: "job-1",
    title: "Desain Website E-commerce Furnitur Lokal",
    companyName: "Java Woodcraft",
    matchPercent: 87,
    applicantCount: 8,
    status: "Aktif",
  },
  {
    id: "job-2",
    title: "Bantu Optimasi SEO Website Toko Herbal",
    companyName: "Herbal Sehat Abadi",
    matchPercent: 91,
    applicantCount: 5,
    status: "Aktif",
  },
];

export const recentApplicants: OwnerRecentApplicant[] = [
  {
    id: "applicant-1",
    name: "Chello Saputra",
    role: "UI/UX Designer",
    avatarUrl: "https://ui-avatars.com/api/?name=Chello+Saputra&background=random",
    matchPercent: 94,
    appliedAtLabel: "1 jam yang lalu",
  },
  {
    id: "applicant-2",
    name: "Maya Amelia",
    role: "Frontend Developer",
    avatarUrl: "https://ui-avatars.com/api/?name=Maya+Amelia&background=random",
    matchPercent: 88,
    appliedAtLabel: "3 jam yang lalu",
  },
];
