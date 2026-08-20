import { Wallet, Calendar, Clock, BarChart3 } from "lucide-react";
import { DashboardStat } from "@/types/dashboard";
import {
  EarningsChartPoint,
  Transaction,
  PaymentMethod,
  UpcomingWithdrawal,
} from "@/types/earnings";

export const earningsStats: DashboardStat[] = [
  { id: "total", label: "Total Pendapatan", value: "Rp 8.500.000", icon: Wallet },
  { id: "month", label: "Bulan Ini", value: "Rp 2.350.000", icon: Calendar },
  { id: "pending", label: "Pending", value: "Rp 1.200.000", icon: Clock },
  {
    id: "average",
    label: "Rata-rata per Project",
    value: "Rp 1.416.000",
    icon: BarChart3,
  },
];

// Estimasi dari proporsi tinggi bar di mockup — cuma Agustus (Rp 2.35M) yang
// eksplisit tertulis di tooltip mockup, 5 bulan lain hasil tebakan visual.
export const earningsChartData: EarningsChartPoint[] = [
  { label: "Mar", amount: 600000 },
  { label: "Apr", amount: 1150000 },
  { label: "Mei", amount: 850000 },
  { label: "Jun", amount: 1400000 },
  { label: "Jul", amount: 1650000 },
  { label: "Agu", amount: 2350000 },
];

export const transactions: Transaction[] = [
  {
    id: "tx-1",
    title: "Website E-commerce Furnitur",
    clientName: "Java Woodcraft",
    amount: 3000000,
    dateLabel: "15 Jul 2024",
    status: "Diterima",
  },
  {
    id: "tx-2",
    title: "Landing Page Warung Bu Tedjo",
    clientName: "Warung Bu Tedjo",
    amount: 2500000,
    dateLabel: "28 Jun 2024",
    status: "Diterima",
  },
  {
    id: "tx-3",
    title: "SEO Website Toko Herbal",
    clientName: "Herbal Sehat Abadi",
    amount: 1200000,
    dateLabel: "5 Agu 2024",
    status: "Pending",
  },
  {
    id: "tx-4",
    title: "Dashboard Analytics",
    clientName: "DataViz Indonesia",
    amount: 1800000,
    dateLabel: "10 Agu 2024",
    status: "Diproses",
  },
];

export const paymentMethods: PaymentMethod[] = [
  {
    id: "pm-1",
    name: "Bank BCA",
    detail: "**** 4829",
    logoInitials: "BCA",
    logoColorClass: "bg-blue-900",
    isPrimary: true,
  },
  {
    id: "pm-2",
    name: "GoPay",
    detail: "chello@email.com",
    logoInitials: "GoPay",
    logoColorClass: "bg-teal-500",
    isPrimary: false,
  },
];

export const upcomingWithdrawal: UpcomingWithdrawal = {
  amountLabel: "Rp 1.200.000",
  dateLabel: "20 Agustus 2024",
  statusLabel: "Dijadwalkan",
};