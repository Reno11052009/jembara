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
        <h3 className="font-display text-base font-black text-ink">
          Riwayat Nilai Proyek
        </h3>
      </div>

      <div className="mt-4 flex flex-col gap-4">
        {transactions.length === 0 ? (
          <p className="rounded-lg bg-canvas p-6 text-center font-body text-sm text-ink-muted">
            Belum ada proyek aktif atau selesai yang memiliki nilai anggaran.
          </p>
        ) : (
          transactions.map((transaction) => (
            <TransactionRow key={transaction.id} transaction={transaction} />
          ))
        )}
      </div>
    </div>
  );
}
