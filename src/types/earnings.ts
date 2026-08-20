export interface EarningsChartPoint {
  label: string;
  amount: number;
}

export type TransactionStatus = "Diterima" | "Pending" | "Diproses";

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