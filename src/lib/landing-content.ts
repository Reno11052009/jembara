import type { ProcessStep } from "@/types/landing";
import { BarChart3, Code2, PenLine, Smartphone } from "lucide-react";
import { FaFigma, FaInstagram } from "react-icons/fa";
import type { ServiceCategory } from "@/types/landing";
export const processSteps: ProcessStep[] = [
  { number: "01", title: "UMKM Pasang Project", description: "Tulis kebutuhan, budget tetap, deadline, lokasi, serta skill wajib dan opsional." },
  { number: "02", title: "Smart Matching", description: "Jembara memberi ranking dari skill, portofolio, rating, budget, ketersediaan, dan lokasi." },
  { number: "03", title: "Pilih dan Kolaborasi", description: "UMKM memilih satu talent, mengamankan pembayaran, lalu berkolaborasi hingga hasil direview." },
  { number: "04", title: "Reputasi Bertumbuh", description: "Proyek selesai dan ulasan nyata memperbarui reputasi serta Skill Passport talent." },
];
export const serviceCategories: ServiceCategory[] = [
  { icon: Code2, title: "Web Development", activeProjectsLabel: "Didukung Smart Matching" },
  { icon: FaFigma, title: "UI/UX Design", activeProjectsLabel: "Didukung Smart Matching" },
  { icon: FaInstagram, title: "Social Media", activeProjectsLabel: "Didukung Smart Matching" },
  { icon: PenLine, title: "Content Writing", activeProjectsLabel: "Didukung Smart Matching" },
  { icon: Smartphone, title: "Mobile App", activeProjectsLabel: "Didukung Smart Matching" },
  { icon: BarChart3, title: "Data Analytics", activeProjectsLabel: "Didukung Smart Matching" },
];
