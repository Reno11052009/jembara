import type { AdminUmkmRow } from "@/types/admin-umkm";

export const adminUmkmVerificationOptions = [
  { label: "Terverifikasi", value: "terverifikasi" },
  { label: "Pending Approval", value: "pending" },
  { label: "Ditolak", value: "ditolak" },
];

export const adminUmkmRows: AdminUmkmRow[] = [
  {
    id: "1",
    ownerName: "Budi Santoso",
    businessName: "Java Woodcraft",
    email: "budi@javawood.com",
    category: "Kerajinan Kayu / Furnitur",
    location: "Jepara",
    jobCount: 4,
    verification: "terverifikasi",
    registeredDate: "15 Nov 2025",
  },
  {
    id: "2",
    ownerName: "Siti Aminah",
    businessName: "Batik Indah",
    email: "siti.batik@gmail.com",
    category: "Tekstil / Fashion",
    location: "Solo",
    jobCount: 1,
    verification: "pending",
    registeredDate: "22 Jan 2026",
  },
  {
    id: "3",
    ownerName: "Heri Susanto",
    businessName: "Warung Jaya",
    email: "herisus@warung.com",
    category: "Makanan & Minuman",
    location: "Malang",
    jobCount: 0,
    verification: "ditolak",
    rejectionReason: "KTP palsu",
    registeredDate: "10 Des 2025",
  },
];
