import type { AdminRelationRow } from "@/types/admin-relations";

export const relationFilterTabs = [
  { label: "Semua Kontrak", value: "semua" },
  { label: "Aktif (Berlangsung)", value: "aktif" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

export const adminRelationRows: AdminRelationRow[] = [
  {
    id: "1",
    umkmOwnerName: "Budi Santoso",
    umkmBusinessName: "Java Woodcraft",
    talentName: "Chello Saputra",
    talentInstitution: "Universitas Indonesia",
    projectName: "Desain E-commerce Furnitur",
    contractValue: "Rp 4.500.000",
    status: "aktif",
    progressPercent: 60,
  },
  {
    id: "2",
    umkmOwnerName: "Tedjo Utama",
    umkmBusinessName: "Warung Bu Tedjo",
    talentName: "Maya Amelia",
    talentInstitution: "Telkom University",
    projectName: "Landing Page Warung Bu Tedjo",
    contractValue: "Rp 2.500.000",
    status: "selesai",
    rating: 5.0,
    timeline: [
      { id: "1", label: "Kombinasi Awal", date: "3 Jan" },
      { id: "2", label: "Wireframing Disetujui", date: "8 Jan" },
      { id: "3", label: "Coding Tahap Akhir", date: "18 Jan" },
      { id: "4", label: "Handover & Rilis", date: "24 Jan" },
    ],
  },
];
