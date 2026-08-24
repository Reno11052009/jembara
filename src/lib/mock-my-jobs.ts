import type { MyJobListing } from "@/types/my-jobs";

// NOTE: same as Cari Talent / Pasang Lowongan — not wired to Prisma yet, since
// the schema doesn't model "Lowongan" (job listing) as its own entity.

export const myJobListings: MyJobListing[] = [
  {
    id: "lowongan-1",
    title: "Desain Website E-commerce Furnitur Lokal",
    postedDateLabel: "10 Jul 2024",
    applicantCount: 8,
    budgetLabel: "Rp 2.500.000 - 5.000.000",
    status: "Aktif",
  },
  {
    id: "lowongan-2",
    title: "Bantu Optimasi SEO Website Toko Herbal",
    postedDateLabel: "12 Jul 2024",
    applicantCount: 5,
    budgetLabel: "Rp 1.200.000 - 2.000.000",
    status: "Aktif",
  },
  {
    id: "lowongan-3",
    title: "Copywriter Konten Media Sosial Bulanan",
    postedDateLabel: "15 Jun 2024",
    applicantCount: 15,
    budgetLabel: "Rp 1.000.000",
    status: "Ditutup",
  },
  {
    id: "lowongan-4",
    title: "Pembuatan Video Profile Java Woodcraft",
    postedDateLabel: "18 Jul 2024",
    applicantCount: 0,
    budgetLabel: "Rp 3.500.000",
    status: "Draft",
  },
];
