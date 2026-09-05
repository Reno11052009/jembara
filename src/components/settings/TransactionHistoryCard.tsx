import type { Transaction } from "@/types/settings";

export default function TransactionHistoryCard({
  transactions,
}: {
  transactions: Transaction[];
}) {
  const getStatusClassName = (status: string) => {
    if (["Ditolak", "Gagal", "Ditarik Kembali"].includes(status)) {
      return "bg-danger-soft text-danger";
    }
    if (
      ["Menunggu Admin", "Menunggu Pembayaran", "Dana Ditahan"].includes(
        status,
      )
    ) {
      return "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300";
    }
    if (["Dibatalkan", "Kedaluwarsa", "Dikembalikan"].includes(status)) {
      return "bg-neutral-100 text-neutral-600 dark:bg-white/10 dark:text-ink-muted";
    }
    return "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-400";
  };

  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-[#2A2A2A] bg-white dark:bg-card p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
        Riwayat Transaksi
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50 dark:bg-void">
              <th className="font-body text-xs font-semibold text-neutral-500 dark:text-ink-muted text-left px-4 py-3 rounded-l-lg">
                Tanggal
              </th>
              <th className="font-body text-xs font-semibold text-neutral-500 dark:text-ink-muted text-left px-4 py-3">
                Deskripsi
              </th>
              <th className="font-body text-xs font-semibold text-neutral-500 dark:text-ink-muted text-right px-4 py-3">
                Jumlah
              </th>
              <th className="font-body text-xs font-semibold text-neutral-500 dark:text-ink-muted text-left px-4 py-3 rounded-r-lg">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECECEC]">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="font-body text-sm text-neutral-900 dark:text-ink px-4 py-4 whitespace-nowrap">
                  {transaction.date}
                </td>
                <td className="font-body text-sm text-neutral-900 dark:text-ink px-4 py-4">
                  {transaction.description}
                </td>
                <td
                  className={`font-body text-sm font-semibold text-right px-4 py-4 whitespace-nowrap ${
                    transaction.amountType === "credit"
                      ? "text-green-600 dark:text-green-400"
                      : transaction.amountType === "debit"
                        ? "text-red-600 dark:text-red-400"
                        : "text-neutral-700 dark:text-ink"
                  }`}
                >
                  {transaction.amountType === "credit"
                    ? "+ "
                    : transaction.amountType === "debit"
                      ? "- "
                      : ""}
                  {transaction.amount}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`rounded-full px-3 py-1 font-body text-xs font-semibold ${getStatusClassName(transaction.status)}`}
                  >
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {transactions.length === 0 && (
          <p className="py-8 text-center text-sm text-ink-muted">
            Belum ada transaksi pembayaran atau penarikan.
          </p>
        )}
      </div>
    </section>
  );
}
