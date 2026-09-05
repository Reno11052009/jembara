import type { WithdrawalListItem } from "@/types/withdrawal";

const statusClasses = {
  PENDING: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
  COMPLETED: "bg-success/10 text-success",
  REJECTED: "bg-danger-soft text-danger",
} as const;

export default function WithdrawalHistory({
  requests,
}: {
  requests: WithdrawalListItem[];
}) {
  return (
    <section className="rounded-2xl border border-hairline bg-card p-6">
      <h2 className="font-display text-lg font-black text-ink">Riwayat Penarikan</h2>
      {requests.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-hairline p-8 text-center text-sm text-ink-muted">
          Belum ada permintaan penarikan.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-hairline">
          {requests.map((request) => (
            <article key={request.id} className="flex flex-wrap items-center justify-between gap-4 py-4 first:pt-0 last:pb-0">
              <div>
                <p className="font-display text-base font-black text-ink">{request.amountLabel}</p>
                <p className="mt-1 text-sm text-ink-muted">
                  {request.provider} · {request.accountName} · {request.accountNumber}
                </p>
                <p className="mt-1 text-xs text-ink-muted">Diajukan {request.createdAtLabel}</p>
                {request.adminNote && (
                  <p className="mt-2 text-sm text-ink">Catatan Admin: {request.adminNote}</p>
                )}
              </div>
              <div className="text-right">
                <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusClasses[request.status]}`}>
                  {request.statusLabel}
                </span>
                {request.processedAtLabel && (
                  <p className="mt-2 text-xs text-ink-muted">Diproses {request.processedAtLabel}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
