export interface EarningsChartPoint {
  period: string;
  label: string;
  amount: number;
}

export type TransactionStatus = "Selesai" | "Dalam Review" | "Berjalan";

export interface Transaction {
  id: string;
  title: string;
  clientName: string;
  amount: number;
  dateLabel: string;
  status: TransactionStatus;
}

export interface PaymentMethod {
  id: string;
  name: string;
  detail: string;
  logoInitials: string;
  logoColorClass: string;
  isPrimary: boolean;
}

export interface UpcomingWithdrawal {
  amountLabel: string;
  dateLabel: string;
  statusLabel: string;
}

export interface EarningsData {
  walletBalanceLabel: string;
  stats: DashboardStat[];
  chartData: EarningsChartPoint[];
  transactions: Transaction[];
  pagination: import("@/types/pagination").PaginationData;
}
import type { DashboardStat } from "@/types/dashboard";
