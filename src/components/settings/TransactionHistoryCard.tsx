import { mockTransactions } from "@/lib/mock-payment-settings";

export default function TransactionHistoryCard() {
  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Riwayat Transaksi
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-neutral-50">
              <th className="font-body text-xs font-semibold text-neutral-500 text-left px-4 py-3 rounded-l-lg">
                Tanggal
              </th>
              <th className="font-body text-xs font-semibold text-neutral-500 text-left px-4 py-3">
                Deskripsi
              </th>
              <th className="font-body text-xs font-semibold text-neutral-500 text-right px-4 py-3">
                Jumlah
              </th>
              <th className="font-body text-xs font-semibold text-neutral-500 text-left px-4 py-3 rounded-r-lg">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#ECECEC]">
            {mockTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="font-body text-sm text-neutral-900 px-4 py-4 whitespace-nowrap">
                  {transaction.date}
                </td>
                <td className="font-body text-sm text-neutral-900 px-4 py-4">
                  {transaction.description}
                </td>
                <td
                  className={`font-body text-sm font-semibold text-right px-4 py-4 whitespace-nowrap ${
                    transaction.amountType === "credit"
                      ? "text-green-600"
                      : "text-neutral-900"
                  }`}
                >
                  {transaction.amountType === "credit" ? "+ " : "- "}
                  {transaction.amount}
                </td>
                <td className="px-4 py-4">
                  <span className="font-body text-xs font-semibold text-green-700 bg-green-50 rounded-full px-3 py-1">
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
