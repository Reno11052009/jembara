"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { decideWithdrawalRequestAction } from "@/app/actions/withdrawals";
import Button from "@/components/ui/Button";
import type { WithdrawalListItem } from "@/types/withdrawal";

function WithdrawalDecision({ request }: { request: WithdrawalListItem }) {
  const router = useRouter();
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function decide(decision: "COMPLETE" | "REJECT") {
    const confirmation = await Swal.fire({
      icon: "warning",
      title:
        decision === "COMPLETE"
          ? "Transfer sudah dilakukan?"
          : "Tolak permintaan penarikan?",
      text:
        decision === "COMPLETE"
          ? "Pastikan transfer manual sudah dilakukan sebelum menandai penarikan selesai."
          : "Saldo penarikan akan dikembalikan kepada Student.",
      showCancelButton: true,
      confirmButtonText:
        decision === "COMPLETE" ? "Tandai Selesai" : "Tolak & Kembalikan Saldo",
      cancelButtonText: "Batal",
      confirmButtonColor: decision === "COMPLETE" ? "#FF6B35" : "#DC2626",
      focusCancel: true,
      reverseButtons: true,
    });

    if (!confirmation.isConfirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await decideWithdrawalRequestAction(request.id, decision, note);
      if (!result.success) {
        setError(result.error || "Permintaan gagal diproses.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="mt-4 border-t border-hairline pt-4">
      <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
        Catatan Admin (opsional)
        <textarea
          value={note}
          onChange={(event) => setNote(event.target.value)}
          maxLength={500}
          rows={2}
          disabled={isPending}
          className="resize-y rounded-lg border border-hairline bg-card px-3 py-2 text-sm outline-none focus:border-brand"
        />
      </label>
      <div className="mt-3 flex flex-wrap gap-2">
        <Button type="button" size="sm" disabled={isPending} onClick={() => void decide("COMPLETE")}>
          Tandai Selesai
        </Button>
        <Button type="button" size="sm" variant="danger-outline" disabled={isPending} onClick={() => void decide("REJECT")}>
          Tolak & Kembalikan Saldo
        </Button>
      </div>
      {error && <p role="alert" className="mt-3 text-sm font-semibold text-danger">{error}</p>}
    </div>
  );
}

export default function AdminWithdrawalList({
  requests,
}: {
  requests: WithdrawalListItem[];
}) {
  return (
    <section className="space-y-4">
      {requests.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-hairline bg-card p-10 text-center text-sm text-ink-muted">
          Belum ada permintaan penarikan.
        </div>
      ) : (
        requests.map((request) => (
          <article key={request.id} className="rounded-2xl border border-hairline bg-card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-lg font-black text-ink">{request.amountLabel}</p>
                <p className="mt-1 text-sm font-semibold text-ink">{request.studentName}</p>
                <p className="text-xs text-ink-muted">{request.studentEmail}</p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                request.status === "PENDING"
                  ? "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300"
                  : request.status === "COMPLETED"
                    ? "bg-success/10 text-success"
                    : "bg-danger-soft text-danger"
              }`}>
                {request.statusLabel}
              </span>
            </div>
            <dl className="mt-4 grid gap-3 rounded-xl bg-canvas p-4 text-sm sm:grid-cols-3">
              <div><dt className="text-ink-muted">Tujuan</dt><dd className="mt-1 font-semibold text-ink">{request.provider}</dd></div>
              <div><dt className="text-ink-muted">Nama rekening</dt><dd className="mt-1 font-semibold text-ink">{request.accountName}</dd></div>
              <div><dt className="text-ink-muted">Nomor</dt><dd className="mt-1 font-semibold text-ink">{request.accountNumber}</dd></div>
            </dl>
            <p className="mt-3 text-xs text-ink-muted">Diajukan {request.createdAtLabel}</p>
            {request.adminNote && <p className="mt-2 text-sm text-ink">Catatan: {request.adminNote}</p>}
            {request.status === "PENDING" && <WithdrawalDecision request={request} />}
          </article>
        ))
      )}
    </section>
  );
}
