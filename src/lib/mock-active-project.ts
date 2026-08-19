import { ActiveProject, ActiveProjectStatus, MonthlyActivityStats } from "@/types/active-project";

export const monthlyActivityStats: MonthlyActivityStats = {
  activeProjectsLabel: "3 Berjalan",
  completedThisMonthLabel: "2 Selesai",
  totalEarningsLabel: "Rp 8.500.000",
  averageRatingLabel: "4.9 ★",
};

export const collaborationTip =
  "Selalu komunikasikan perkembangan milestone Anda kepada UMKM secara teratur melalui fitur Pesan untuk membangun kepercayaan jangka panjang.";

// Statis mengikuti mockup (2/1/5) — array di bawah baru punya 3 sample
// (belum ada contoh berstatus "Completed").
export const activeProjectTabCounts: Record<ActiveProjectStatus, number> = {
  "In Progress": 2,
  "In Review": 1,
  "Completed": 5,
};

export const activeProjects: ActiveProject[] = [
  {
    id: "ap-1",
    title: "Redesign App Laundry Koin",
    clientName: "Laundry Bersih",
    status: "In Progress",
    progressPercent: 60,
    milestones: [
      { id: "m1", label: "Riset Kompetitor & User Persona", done: true },
      { id: "m2", label: "Wireframing & Desain Alur Pembayaran", done: true },
      { id: "m3", label: "High Fidelity UI Design & Prototype", done: false },
      { id: "m4", label: "Developer Handoff & Asset Asset", done: false },
    ],
    budgetLabel: "Rp 3.000.000",
    deadlineLabel: "6 Hari Tersisa",
  },
  {
    id: "ap-2",
    title: "Landing Page Warung Bu Tedjo",
    clientName: "Warung Bu Tedjo",
    status: "In Review",
    progressPercent: 100,
    milestones: [
      { id: "m1", label: "Desain Layout Landing Page", done: true },
      { id: "m2", label: "Slicing Frontend & Integrasi Animasi", done: true },
      { id: "m3", label: "Deployment ke Vercel & Testing", done: true },
    ],
    budgetLabel: "Rp 2.500.000",
    deadlineLabel: "Menunggu Review Klien",
  },
  {
    id: "ap-3",
    title: "Optimasi SEO Website Kerajinan Tangan",
    clientName: "Artisan Craft ID",
    status: "In Progress",
    progressPercent: 35,
    milestones: [
      { id: "m1", label: "Audit SEO & Struktur Website", done: true },
      { id: "m2", label: "Riset Keyword Potensial", done: false },
      { id: "m3", label: "Optimasi On-page Content", done: false },
    ],
    budgetLabel: "Rp 1.800.000",
    deadlineLabel: "14 Hari Tersisa",
  },
];