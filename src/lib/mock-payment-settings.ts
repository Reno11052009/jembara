import type { PaymentMethod, Transaction } from "@/types/settings";

export const mockPaymentMethods: PaymentMethod[] = [
  {
    id: "payment-method-1",
    name: "Bank BCA",
    detailLine: "Chello Arta • **** 8940",
    isPrimary: true,
  },
  {
    id: "payment-method-2",
    name: "GoPay E-Wallet",
    detailLine: "Chello Arta • 0812 **** 7890",
    isPrimary: false,
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: "transaction-1",
    date: "15 Jan 2026",
    description: "Penarikan Dana ke Bank BCA",
    amount: "Rp 1.500.000",
    amountType: "debit",
    status: "Selesai",
  },
  {
    id: "transaction-2",
    date: "12 Jan 2026",
    description: "Pembayaran Proyek: Redesign Landing Page",
    amount: "Rp 2.450.000",
    amountType: "credit",
    status: "Selesai",
  },
  {
    id: "transaction-3",
    date: "02 Jan 2026",
    description: "Pembayaran Proyek: Ilustrasi Banner",
    amount: "Rp 800.000",
    amountType: "credit",
    status: "Selesai",
  },
  {
    id: "transaction-4",
    date: "28 Des 2025",
    description: "Penarikan Dana ke Bank BCA",
    amount: "Rp 750.000",
    amountType: "debit",
    status: "Selesai",
  },
  {
    id: "transaction-5",
    date: "15 Des 2025",
    description: "Biaya Platform Jasa Layanan",
    amount: "Rp 50.000",
    amountType: "debit",
    status: "Selesai",
  },
];
