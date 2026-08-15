import { FileText, Briefcase, Wallet, Star } from "lucide-react";
import {
  DashboardStat,
  RecommendedProject,
  RunningActivity,
  MessagePreview,
} from "@/types/dashboard";

export const profileCompletionPercent = 78;

export const dashboardStats: DashboardStat[] = [
  { id: "proposals", label: "Proposals Sent", value: "14 Sent", icon: FileText },
  { id: "active", label: "Active Projects", value: "3 Active", icon: Briefcase },
  { id: "earnings", label: "Total Earnings", value: "Rp 8.5M", icon: Wallet },
  { id: "rating", label: "Avg Rating", value: "4.9 ★", icon: Star },
];

export const recommendedProjects: RecommendedProject[] = [
  {
    id: "rp-1",
    title: "Desain Website E-commerce Furnitur Lokal",
    companyName: "Java Woodcraft",
    matchPercent: 87,
    budgetLabel: "Rp 2.500.000 - 5.000.000",
    deadlineLabel: "14 Hari",
    tags: ["UI/UX Design", "Figma"],
    postedLabel: "Diposting 2 jam yang lalu",
  },
  {
    id: "rp-2",
    title: "Bantu Optimasi SEO Website Toko Herbal",
    companyName: "Herbal Sehat Abadi",
    matchPercent: 91,
    budgetLabel: "Rp 1.200.000 - 2.000.000",
    deadlineLabel: "10 Hari",
    tags: ["Web Development", "SEO Specialist"],
    postedLabel: "Diposting 2 jam yang lalu",
  },
];

export const runningActivities: RunningActivity[] = [
  {
    id: "ra-1",
    title: "Redesign App Laundry",
    clientName: "Laundry Bersih",
    status: "in_progress",
  },
  {
    id: "ra-2",
    title: "Landing Page UMKM",
    clientName: "Warung Bu Tedjo",
    status: "completed",
    progressPercent: 100,
  },
];

export const recentMessages: MessagePreview[] = [
  {
    id: "msg-1",
    senderName: "Warung Pak Chello",
    timeLabel: "9:45 AM",
    snippet: "Kapan kira-kira wireframe modul pembayaran selesai?",
  },
  {
    id: "msg-2",
    senderName: "Kopdes Sumawe",
    timeLabel: "Kemarin",
    snippet: "Terima kasih atas proposal yang diajukan.",
  },
];
