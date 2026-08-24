import type { Applicant } from "@/types/applicant";

// NOTE: same as the other UMKM pages — not wired to Prisma yet, this is
// placeholder data for the "Pelamar" (applicants) list of a job listing.

export const projectTitle = "Website Toko Kopi Lokal";

export const applicants: Applicant[] = [
  {
    id: "pelamar-1",
    name: "Chello Saputra",
    rating: 4.9,
    location: "Bandung",
    appliedAtLabel: "Dilamar 1 jam lalu",
    matchPercent: 94,
    proposal:
      "Saya telah membuat 5+ website e-commerce furniture menggunakan Figma & Webflow. Sangat bersemangat mendukung pengrajin kayu lokal...",
    skills: ["UI/UX Design", "Figma", "Webflow"],
    status: "Baru",
  },
  {
    id: "pelamar-2",
    name: "Laras Kirana",
    rating: 4.7,
    location: "Jakarta",
    isRemote: true,
    appliedAtLabel: "Dilamar Dua hari lalu",
    matchPercent: 89,
    proposal:
      "Sangat tertarik membantu UMKM Java Woodcraft naik kelas. Berbekal keahlian UI/UX design dan copywriting yang saya miliki...",
    skills: ["UI/UX Design", "Figma", "Webflow"],
    status: "Baru",
  },
];
