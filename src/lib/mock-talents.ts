import type { Talent, TalentFilterOption } from "@/types/talent";

// NOTE: like OwnerDashboardView, "Cari Talent" isn't wired to Prisma yet —
// the schema has no talent-search/match-percent concept for UMKM. Data below
// is placeholder until the backend model for this is decided.

const baseTalents: Omit<Talent, "id">[] = [
  {
    name: "Ahmad Setiawan",
    role: "UI/UX Designer",
    matchPercent: 96,
    rating: 4.9,
    rateLabel: "Rp 150K/jam",
    ratePerHour: 150_000,
    location: "Bandung",
    experienceLevel: "1-2 Tahun",
    skills: ["Figma", "User Research", "Wireframing"],
  },
  {
    name: "Dewi Lestari",
    role: "Backend Developer",
    matchPercent: 91,
    rating: 4.8,
    rateLabel: "Rp 200K/jam",
    ratePerHour: 200_000,
    location: "Jakarta",
    isRemote: true,
    experienceLevel: "3-5 Tahun",
    skills: ["Node.js", "Express", "PostgreSQL"],
  },
  {
    name: "Bagus Pratama",
    role: "Fullstack Developer",
    matchPercent: 88,
    rating: 4.9,
    rateLabel: "Rp 250K/jam",
    ratePerHour: 250_000,
    location: "Yogyakarta",
    experienceLevel: "3-5 Tahun",
    skills: ["React", "Node.js", "TailwindCSS"],
  },
];

export const recommendedTalents: Talent[] = Array.from({ length: 3 }).flatMap(
  (_, row) =>
    baseTalents.map((talent, index) => ({
      ...talent,
      id: `talent-${row}-${index}`,
    })),
);

export const skillOptions: TalentFilterOption[] = [
  { label: "Figma", value: "Figma" },
  { label: "User Research", value: "User Research" },
  { label: "Wireframing", value: "Wireframing" },
  { label: "Node.js", value: "Node.js" },
  { label: "Express", value: "Express" },
  { label: "PostgreSQL", value: "PostgreSQL" },
  { label: "React", value: "React" },
  { label: "TailwindCSS", value: "TailwindCSS" },
];

export const locationOptions: TalentFilterOption[] = [
  { label: "Bandung", value: "Bandung" },
  { label: "Jakarta", value: "Jakarta" },
  { label: "Yogyakarta", value: "Yogyakarta" },
];

export const ratingOptions: TalentFilterOption[] = [
  { label: "4.5 ke atas", value: "4.5" },
  { label: "4.0 ke atas", value: "4.0" },
  { label: "3.5 ke atas", value: "3.5" },
];

export const experienceOptions: TalentFilterOption[] = [
  { label: "Fresh Graduate", value: "Fresh Graduate" },
  { label: "1-2 Tahun", value: "1-2 Tahun" },
  { label: "3-5 Tahun", value: "3-5 Tahun" },
];

export const budgetOptions: TalentFilterOption[] = [
  { label: "< Rp 150K/jam", value: "under-150k" },
  { label: "Rp 150K - 200K/jam", value: "150k-200k" },
  { label: "Rp 200K - 250K/jam", value: "200k-250k" },
  { label: "> Rp 250K/jam", value: "over-250k" },
];
