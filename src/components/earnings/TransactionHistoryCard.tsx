import Link from "next/link";
import { Transaction } from "@/types/earnings";
import TransactionRow from "@/components/earnings/TransactionRow";

interface TransactionHistoryCardProps {
  transactions: Transaction[];
}

export default function TransactionHistoryCard({
  transactions,
}: TransactionHistoryCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-base font-black text-ink">Riwayat Transaksi</h3>
        <Link href="#" className="font-body text-base font-bold text-brand hover:underline">
          Lihat Semua
        </Link>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {transactions.map((transaction) => (
          <TransactionRow key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
}