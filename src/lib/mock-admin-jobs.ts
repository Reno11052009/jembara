import { CheckCircle2, Clock, FileText, Users } from "lucide-react";
import type { AdminStat } from "@/types/admin-dashboard";
import type { AdminJobRow } from "@/types/admin-jobs";

export const jobStats: AdminStat[] = [
  { id: "total", label: "Total Lowongan", value: "8,920", icon: FileText },
  { id: "aktif", label: "Aktif Terbuka", value: "1,200", icon: CheckCircle2 },
  { id: "matched", label: "Sudah Terisi (Matched)", value: "6,450", icon: Users },
  { id: "expired", label: "Kedaluwarsa (Expired)", value: "1,270", icon: Clock },
];

export const adminJobRows: AdminJobRow[] = [
  {
    id: "1",
    title: "Desain E-commerce Furnitur",
    ownerBusinessName: "Java Woodcraft",
    category: "UI/UX Design",
    budgetLabel: "Rp 2.5M - 5M",
    applicantCount: 8,
    status: "aktif",
  },
  {
    id: "2",
    title: "Jaringan Kerja Misterius",
    ownerBusinessName: "Kreatif Gelap",
    category: "Dev / Tech",
    budgetLabel: "Rp 15.0M",
    applicantCount: 0,
    status: "terlaporkan",
    flagged: true,
  },
];
