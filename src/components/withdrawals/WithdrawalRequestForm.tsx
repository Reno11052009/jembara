"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { BanknoteArrowDown, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createWithdrawalRequestAction } from "@/app/actions/withdrawals";
import Button from "@/components/ui/Button";
import type { PayoutMethodOption } from "@/types/withdrawal";

const MINIMUM_WITHDRAWAL = 10_000;

export default function WithdrawalRequestForm({
  balance,
  balanceLabel,
  payoutMethods,
}: {
  balance: number;
  balanceLabel: string;
  payoutMethods: PayoutMethodOption[];
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const canWithdraw = balance >= MINIMUM_WITHDRAWAL;
  const canSubmit = canWithdraw && payoutMethods.length > 0;
  const primaryMethod = payoutMethods.find(({ isPrimary }) => isPrimary) ?? payoutMethods[0];

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFeedback(null);
    startTransition(async () => {
      const result = await createWithdrawalRequestAction(formData);
      if (!result.success) {
        setFeedback({
          type: "error",
          message: result.error || "Permintaan penarikan gagal dibuat.",
        });
        return;
      }
      formRef.current?.reset();
      setFeedback({
        type: "success",
        message: "Permintaan berhasil dikirim dan menunggu diproses Admin.",
      });
      router.refresh();
    });
  }

  return (
    <section className="rounded-2xl border border-hairline bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-brand">
            <BanknoteArrowDown size={22} />
            <h2 className="font-display text-lg font-black text-ink">Tarik Saldo</h2>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            Minimum penarikan Rp10.000. Saldo akan dicadangkan sampai Admin memproses permintaan.
          </p>
        </div>
        <div className="rounded-xl bg-brand-soft px-4 py-3 text-right">
          <p className="text-xs font-semibold text-ink-muted">Saldo tersedia</p>
          <p className="font-display text-lg font-black text-brand">{balanceLabel}</p>
        </div>
      </div>

      <form ref={formRef} onSubmit={handleSubmit} className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          Nominal penarikan
          <input
            name="amount"
            type="number"
            required
            min={MINIMUM_WITHDRAWAL}
            max={balance}
            step="1000"
            disabled={!canSubmit || isPending}
            placeholder="10000"
            className="rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
          Metode pencairan
          <select
            name="payoutMethodId"
            required
            defaultValue={primaryMethod?.id ?? ""}
            disabled={!canSubmit || isPending}
            className="rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand disabled:cursor-not-allowed disabled:opacity-60"
          >
            {payoutMethods.length === 0 && <option value="">Belum ada rekening tersimpan</option>}
            {payoutMethods.map((method) => (
              <option key={method.id} value={method.id}>
                {method.label}{method.isPrimary ? " (Utama)" : ""}
              </option>
            ))}
          </select>
        </label>

        <div className="flex flex-wrap items-center gap-3 md:col-span-2">
          <Button type="submit" isLoading={isPending} disabled={!canSubmit || isPending}>
            Ajukan Penarikan
          </Button>
          <p className="flex items-center gap-1.5 text-xs text-ink-muted">
            <ShieldCheck size={15} className="text-success" />
            Pastikan nama dan nomor tujuan sudah benar.
          </p>
        </div>
      </form>

      {!canWithdraw && (
        <p className="mt-4 rounded-lg bg-orange-50 p-3 text-sm font-semibold text-orange-700 dark:bg-orange-500/15 dark:text-orange-300">
          Saldo belum mencapai minimum penarikan Rp10.000.
        </p>
      )}
      {payoutMethods.length === 0 && (
        <p className="mt-4 rounded-lg bg-brand-soft p-3 text-sm text-ink">
          Tambahkan rekening atau e-wallet terlebih dahulu di{" "}
          <Link href="/dashboard/settings/pembayaran" className="font-bold text-brand underline">
            Pengaturan Pembayaran
          </Link>.
        </p>
      )}
      {feedback && (
        <p
          role={feedback.type === "error" ? "alert" : "status"}
          className={`mt-4 rounded-lg p-3 text-sm font-semibold ${
            feedback.type === "error"
              ? "bg-danger-soft text-danger"
              : "bg-success/10 text-success"
          }`}
        >
          {feedback.message}
        </p>
      )}
    </section>
  );
}
