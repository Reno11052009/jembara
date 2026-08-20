import { FolderOpen, Briefcase, Star, Eye } from "lucide-react";
import { DashboardStat } from "@/types/dashboard";
import {
  PortfolioProject,
  SkillEndorsement,
  PortfolioTestimonial,
} from "@/types/portfolio";

export const portfolioStats: DashboardStat[] = [
  { id: "total", label: "Total Projects", value: "8", icon: FolderOpen },
  { id: "completed", label: "Completed", value: "6", icon: Briefcase },
  { id: "rating", label: "Average Rating", value: "4.9 ★", icon: Star },
  { id: "views", label: "Profile Views", value: "234", icon: Eye },
];

export const portfolioProjects: PortfolioProject[] = [
  {
    id: "pp-1",
    title: "Website E-commerce Furnitur Lokal",
    clientName: "Java Woodcraft",
    tags: ["UI/UX Design", "Web Development"],
    rating: 5.0,
    completedLabel: "Selesai 2 bulan lalu",
    verified: true,
  },
  {
    id: "pp-2",
    title: "Landing Page Warung Bu Tedjo",
    clientName: "Warung Bu Tedjo",
    tags: ["Web Design", "Branding"],
    rating: 4.8,
    completedLabel: "Selesai 3 minggu lalu",
    verified: true,
  },
  {
    id: "pp-3",
    title: "Dashboard Analytics SaaS",
    clientName: "DataViz Indonesia",
    tags: ["Dashboard Design", "Data Visualization"],
    rating: 5.0,
    completedLabel: "Selesai 1 minggu lalu",
    verified: true,
  },
];

export const skillEndorsements: SkillEndorsement[] = [
  { id: "sk-1", name: "UI/UX Design", percent: 95, endorsementCount: 12 },
  { id: "sk-2", name: "HTML/CSS/JS", percent: 90, endorsementCount: 8 },
  { id: "sk-3", name: "Figma", percent: 88, endorsementCount: 10 },
  { id: "sk-4", name: "React", percent: 75, endorsementCount: 5 },
];

export const portfolioTestimonials: PortfolioTestimonial[] = [
  {
    id: "pt-1",
    clientName: "Java Woodcraft",
    rating: 5.0,
    quote:
      "Kerjanya sangat profesional dan hasilnya memuaskan. Sangat direkomendasikan!",
  },
  {
    id: "pt-2",
    clientName: "Warung Bu Tedjo",
    rating: 4.8,
    quote:
      "Desainnya modern dan sesuai dengan brand kami. Komunikasi juga sangat baik.",
  },
];