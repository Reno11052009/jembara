import { Code2, PenLine, Smartphone, BarChart3 } from "lucide-react";
import { FaFigma, FaInstagram } from "react-icons/fa";
import {
  ProcessStep,
  ServiceCategory,
  Talent,
  LandingProject,
  StatItem,
  Testimonial,
} from "@/types/landing";

export const processSteps: ProcessStep[] = [
  {
    number: "01",
    title: "UMKM Pasang Project",
    description:
      "Tulis kebutuhan layanan digital Anda secara detail, lengkap dengan estimasi budget.",
  },
  {
    number: "02",
    title: "Smart Matching",
    description:
      "Sistem kami mencocokkan project dengan mahasiswa yang memiliki kualifikasi paling pas.",
  },
  {
    number: "03",
    title: "Mahasiswa Melamar",
    description:
      "Pelajari proposal dari berbagai mahasiswa bertalenta tinggi dan pilih kandidat favorit.",
  },
  {
    number: "04",
    title: "Kolaborasi Sukses",
    description:
      "Kelola project dengan aman di platform kami hingga selesai memuaskan.",
  },
];

export const serviceCategories: ServiceCategory[] = [
  { icon: Code2, title: "Web Development", activeProjectsLabel: "120 Active Projects" },
  { icon: FaFigma, title: "UI/UX Design", activeProjectsLabel: "85 Active Projects" },
  { icon: FaInstagram, title: "Social Media", activeProjectsLabel: "150 Active Projects" },
  { icon: PenLine, title: "Content Writing", activeProjectsLabel: "92 Active Projects" },
  { icon: Smartphone, title: "Mobile App", activeProjectsLabel: "64 Active Projects" },
  { icon: BarChart3, title: "Data Analytics", activeProjectsLabel: "40 Active Projects" },
];

export const topTalents: Talent[] = [
  {
    id: "1",
    name: "Chello Arta",
    school: "SMK PGRI 03 Malang",
    specialty: "UI/UX Specialist",
    rating: 4.9,
    completedLabel: "12 Selesai",
    skills: ["Figma", "Web Design", "Wireframing"],
  },
  {
    id: "2",
    name: "My Reno Arsha",
    school: "SMK PGRI 03 Malang",
    specialty: "Backend Developer",
    rating: 4.8,
    completedLabel: "9 Selesai",
    skills: ["React", "Tailwind CSS", "JavaScript"],
  },
  {
    id: "3",
    name: "Ozakae Corael",
    school: "SMK PGRI 03 Malang",
    specialty: "Frontend & Creator",
    rating: 5.0,
    completedLabel: "15 Selesai",
    skills: ["Penguat Rupiah", "Web Design", "WordPress"],
  },
];

export const latestProjects: LandingProject[] = [
  {
    id: "1",
    clientName: "Warung Bu Tedjo",
    badge: "Premium",
    title: "Desain Landing Page Kuliner Lokal",
    budgetLabel: "Rp 1.500.000",
    durationLabel: "7 Hari",
    tags: ["UI/UX Design", "Web Design"],
  },
  {
    id: "2",
    clientName: "Toko Sembako Maju",
    badge: "Urgent",
    title: "Pembuatan Aplikasi Inventaris Toko",
    budgetLabel: "Rp 4.000.000",
    durationLabel: "21 Hari",
    tags: ["React Native", "Database"],
  },
  {
    id: "3",
    clientName: "Kopi Seduh Rileks",
    badge: "Premium",
    title: "Sosial Media Management & Campaign",
    budgetLabel: "Rp 2.500.000",
    durationLabel: "14 Hari",
    tags: ["Instagram Specialist", "Copywriting"],
  },
];

export const stats: StatItem[] = [
  { value: "5,000+", label: "Mahasiswa Terdaftar" },
  { value: "1,200+", label: "UMKM Terbantu" },
  { value: "3,500+", label: "Project Selesai" },
  { value: "4.8", label: "Rata-Rata Rating" },
];

export const testimonials: Testimonial[] = [
  {
    quote:
      "Jembatan Karya sangat membantu toko online saya berkembang. Pembuatan website rapi, cepat, dan budget sangat pas untuk UMKM.",
    name: "Pak Chello",
    role: "Owner Warung Bu Tedjo",
  },
  {
    quote:
      "Sebagai mahasiswa, platform ini membuka peluang magang riil yang luar biasa. Saya bisa menolong UMKM sekaligus mengisi portofolio saya.",
    name: "Pak Chello",
    role: "S1 Sistem Informasi, UI",
  },
];