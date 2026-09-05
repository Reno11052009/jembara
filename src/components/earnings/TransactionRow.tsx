import { Transaction } from "@/types/earnings";

interface TransactionRowProps {
  transaction: Transaction;
}

const statusStyles: Record<Transaction["status"], { badge: string; amount: string }> = {
  Selesai: { badge: "bg-success/10 text-success", amount: "text-success" },
  "Dalam Review": { badge: "bg-brand-soft text-brand", amount: "text-brand" },
  Berjalan: { badge: "bg-brand-soft text-brand", amount: "text-brand" },
};

function formatRupiah(value: number) {
  return `Rp ${value.toLocaleString("id-ID")}`;
}

export default function TransactionRow({ transaction }: TransactionRowProps) {
  const style = statusStyles[transaction.status];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 rounded-lg bg-canvas p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-black text-ink">
          {transaction.title}
        </p>
        <p className="mt-0.5 truncate font-body text-xs sm:text-sm text-ink-muted">
          {transaction.clientName}
        </p>
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 shrink-0">
        <div className="text-left sm:text-right">
          <p className={`font-display text-sm font-black ${style.amount}`}>
            {formatRupiah(transaction.amount)}
          </p>
          <p className="mt-0.5 font-body text-xs text-ink-muted">{transaction.dateLabel}</p>
        </div>

        <span
          className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-black font-display leading-none ${style.badge}`}
        >
          {transaction.status}
        </span>
      </div>
    </div>
  );
}
