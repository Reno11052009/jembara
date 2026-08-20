import { FolderOpen, Bell, Briefcase, Settings } from "lucide-react";
import { DashboardStat } from "@/types/dashboard";
import { Proposal, ProposalStatus } from "@/types/proposal";

export const proposalStats: DashboardStat[] = [
  { id: "total", label: "Total Proposals", value: "14", icon: FolderOpen },
  { id: "pending", label: "Menunggu Keputusan", value: "5 Pending", icon: Bell },
  { id: "accepted", label: "Disetujui UMKM", value: "7 Accepted", icon: Briefcase },
  { id: "rejected", label: "Ditolak / Batal", value: "2 Rejected", icon: Settings },
];

// Angka ini statis mengikuti mockup (14/5/7/2), BUKAN hasil hitung dari
// array `proposals` di bawah — array ini baru berisi 4 sample sesuai
// yang terlihat di screenshot, belum representasi 14 proposal penuh.
export const proposalTabCounts: Record<"Semua" | ProposalStatus, number> = {
  Semua: 14,
  Pending: 5,
  Accepted: 7,
  Rejected: 2,
};

export const proposals: Proposal[] = [
  {
    id: "prop-1",
    title: "Desain Website E-commerce Furnitur Lokal",
    clientName: "Java Woodcraft",
    description:
      "Halo Java Woodcraft, saya Chello, mahasiswa Desain Komunikasi Visual yang fokus pada e-commerce website. Saya menawarkan rancangan UI/UX interaktif berbasis riset pengguna lokal...",
    matchPercent: 87,
    status: "Pending",
    tags: ["UI/UX Design", "Figma", "Web Design"],
    budgetLabel: "Rp 2.500.000 - 5.000.000",
    submittedLabel: "Diajukan 2 hari yang lalu",
  },
  {
    id: "prop-2",
    title: "Bantu Optimasi SEO Website Toko Herbal",
    clientName: "Herbal Sehat Abadi",
    description:
      "Berdasarkan analisis awal saya, website Anda kekurangan meta tags deskriptif dan struktur heading yang ramah mesin pencari. Saya siap mengoptimalkan performa halaman dalam 10 hari...",
    matchPercent: 91,
    status: "Pending",
    tags: ["SEO Specialist", "Google Analytics", "Content Writing"],
    budgetLabel: "Rp 1.200.000 - 2.000.000",
    submittedLabel: "Diajukan 4 hari yang lalu",
  },
  {
    id: "prop-3",
    title: "Redesign Dashboard Analytics Platform SaaS",
    clientName: "DataViz Indonesia",
    description:
      "Saya telah menyelesaikan 3 project visualisasi data interaktif sebelumnya. Proposal ini mencakup tahapan wireframing hingga uji keterbacaan grafik bagi pengguna awam...",
    matchPercent: 76,
    status: "Accepted",
    tags: ["Dashboard Design", "Data Visualization", "UX Research"],
    budgetLabel: "Rp 4.000.000 - 6.500.000",
    submittedLabel: "Diajukan 1 minggu yang lalu",
  },
  {
    id: "prop-4",
    title: "Aplikasi Mobile Inventory Gudang UMKM",
    clientName: "TokoMaju Digital",
    description:
      "Pengembangan aplikasi mobile inventori dengan integrasi scanner kamera untuk mempermudah stock opname harian secara real-time...",
    matchPercent: 82,
    status: "Rejected",
    tags: ["React Native", "Firebase", "Mobile Development"],
    budgetLabel: "Rp 3.000.000 - 5.000.000",
    submittedLabel: "Diajukan 2 minggu yang lalu",
  },
];