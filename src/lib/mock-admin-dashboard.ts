import {
  AlertTriangle,
  Briefcase,
  Building2,
  FileText,
  Flag,
  ShieldCheck,
  Users,
  Wallet,
} from "lucide-react";
import type {
  AdminQuickAction,
  AdminStat,
  PlatformActivity,
  UserGrowthPoint,
} from "@/types/admin-dashboard";

export const adminName = "Super Admin";

export const adminStats: AdminStat[] = [
  {
    id: "talent",
    label: "Total User Talent",
    value: "12,480",
    subLabel: "+140 minggu ini",
    icon: Users,
  },
  {
    id: "umkm",
    label: "Total Pemilik UMKM",
    value: "3,150",
    subLabel: "+45 minggu ini",
    icon: Building2,
  },
  {
    id: "lowongan",
    label: "Total Lowongan",
    value: "8,920",
    subLabel: "1,200 Aktif",
    icon: FileText,
  },
  {
    id: "proyek",
    label: "Total Proyek Aktif",
    value: "1,840",
    subLabel: "89% penyelesaian",
    icon: Briefcase,
  },
  {
    id: "transaksi",
    label: "Total Transaksi",
    value: "Rp 4.120M",
    subLabel: "Bulan ini: Rp 450M",
    icon: Wallet,
  },
];

export const userGrowthData: UserGrowthPoint[] = [
  { label: "Mar", value: 7200 },
  { label: "Apr", value: 8600 },
  { label: "Mei", value: 9800 },
  { label: "Jun", value: 11200 },
  { label: "Jul", value: 13100 },
  { label: "Agu", value: 14900 },
];

export const adminQuickActions: AdminQuickAction[] = [
  { id: "verifikasi-umkm", label: "Tinjau 12 Verifikasi UMKM", icon: ShieldCheck },
  { id: "pesan-flagged", label: "8 Pesan Dilaporkan (Flagged)", icon: Flag },
  { id: "takedown-lowongan", label: "Takedown Lowongan Melanggar", icon: AlertTriangle },
];

export const platformActivities: PlatformActivity[] = [
  {
    id: "1",
    actorName: "Chello Saputra",
    title: "Chello Saputra (Talent) baru saja mendaftar",
    subtitle: "Kategori: UI/UX Design · Universitas Indonesia",
    timeLabel: "2 menit yang lalu",
  },
  {
    id: "2",
    actorName: "Java Woodcraft",
    title: "Java Woodcraft memasang lowongan baru",
    subtitle: 'Judul: "Desain Website E-commerce Furnitur Lokal" · Budget Rp 5M',
    timeLabel: "1 jam yang lalu",
  },
  {
    id: "3",
    actorName: "Maya Amelia",
    title: 'Proyek "Landing Page Warung Bu Tedjo" Selesai',
    subtitle: "Talent: Maya Amelia · Rating diberikan: 5.0 ★",
    timeLabel: "Kemarin, 14:20",
  },
];
