"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, ShieldCheck } from "lucide-react";
import {
  createProjectPaymentAction,
  syncProjectPaymentAction,
} from "@/app/actions/payments";
import type { ProjectPaymentData } from "@/types/payment";

export default function PaymentCheckout({ payment }: { payment: ProjectPaymentData }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function startPayment() {
    setError(null);
    startTransition(async () => {
      const result = await createProjectPaymentAction(payment.projectId);
      if (!result.success || !result.redirectUrl) {
        setError(result.error || "URL pembayaran tidak tersedia.");
        return;
      }
      window.location.assign(result.redirectUrl);
    });
  }

  function syncPayment() {
    setError(null);
    startTransition(async () => {
      const result = await syncProjectPaymentAction(payment.projectId);
      if (!result.success) {
        setError(result.error || "Status pembayaran belum dapat diperbarui.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="rounded-2xl border border-hairline bg-card p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="rounded-xl bg-success/10 p-3 text-success">
          <ShieldCheck size={28} />
        </div>
        <div>
          <h2 className="font-display text-xl font-black text-ink">Pembayaran Aman Midtrans</h2>
          <p className="mt-1 text-sm leading-6 text-ink-muted">
            Dana ditahan oleh Jembara dan baru menjadi saldo talent setelah hasil kerja Anda setujui.
          </p>
        </div>
      </div>

      <dl className="mt-6 divide-y divide-hairline rounded-xl bg-canvas px-5">
        <div className="flex justify-between gap-4 py-4">
          <dt className="text-sm text-ink-muted">Proyek</dt>
          <dd className="text-right text-sm font-bold text-ink">{payment.projectTitle}</dd>
        </div>
        <div className="flex justify-between gap-4 py-4">
          <dt className="text-sm text-ink-muted">Talent</dt>
          <dd className="text-right text-sm font-bold text-ink">{payment.studentName}</dd>
        </div>
        <div className="flex justify-between gap-4 py-4">
          <dt className="text-sm text-ink-muted">Total pembayaran</dt>
          <dd className="text-right font-display text-lg font-black text-brand">{payment.amountLabel}</dd>
        </div>
        <div className="flex justify-between gap-4 py-4">
          <dt className="text-sm text-ink-muted">Status</dt>
          <dd className="rounded-full bg-brand-soft px-3 py-1 text-xs font-bold text-brand">
            {payment.statusLabel}
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        {payment.canPay && (
          <button
            type="button"
            disabled={isPending}
            onClick={startPayment}
            className="rounded-full bg-brand px-6 py-3 text-sm font-display font-bold text-white hover:opacity-90 disabled:opacity-60"
          >
            {isPending ? "Memproses..." : payment.redirectUrl ? "Lanjutkan Pembayaran" : "Bayar Sekarang"}
          </button>
        )}
        {payment.canSync && (
          <button
            type="button"
            disabled={isPending}
            onClick={syncPayment}
            className="inline-flex items-center gap-2 rounded-full border border-ink px-5 py-3 text-sm font-display font-bold text-ink hover:border-brand hover:text-brand disabled:opacity-60"
          >
            <RefreshCw size={16} /> Cek Status Pembayaran
          </button>
        )}
      </div>

      {payment.status === "HELD" && (
        <p className="mt-5 rounded-xl border border-success/20 bg-success/10 p-4 text-sm font-semibold text-success">
          Pembayaran terverifikasi. Proyek sudah dimulai dan dana sedang ditahan.
        </p>
      )}
      {error && <p role="alert" className="mt-4 rounded-lg bg-danger-soft p-3 text-sm font-semibold text-danger">{error}</p>}
    </div>
  );
}
