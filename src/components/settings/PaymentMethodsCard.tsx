"use client";

import { FormEvent, useRef, useState, useTransition } from "react";
import { CreditCard, Plus, Star, Trash2, X } from "lucide-react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  createPayoutMethodAction,
  deletePayoutMethodAction,
  setPrimaryPayoutMethodAction,
} from "@/app/actions/payout-methods";
import Button from "@/components/ui/Button";
import type { PaymentMethod } from "@/types/settings";

export default function PaymentMethodsCard({ methods }: { methods: PaymentMethod[] }) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function submitMethod(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setFeedback(null);
    startTransition(async () => {
      const result = await createPayoutMethodAction(formData);
      if (!result.success) {
        setFeedback({ type: "error", message: result.error || "Rekening gagal disimpan." });
        return;
      }
      formRef.current?.reset();
      setIsAdding(false);
      setFeedback({ type: "success", message: "Metode pencairan berhasil disimpan." });
      router.refresh();
    });
  }

  async function mutateMethod(action: "PRIMARY" | "DELETE", methodId: string) {
    if (action === "DELETE") {
      const confirmation = await Swal.fire({
        icon: "warning",
        title: "Hapus metode pencairan?",
        text: "Rekening atau e-wallet ini akan dihapus dari akun Anda.",
        showCancelButton: true,
        confirmButtonText: "Hapus",
        cancelButtonText: "Batal",
        confirmButtonColor: "#DC2626",
        focusCancel: true,
        reverseButtons: true,
      });
      if (!confirmation.isConfirmed) return;
    }
    setFeedback(null);
    startTransition(async () => {
      const result =
        action === "PRIMARY"
          ? await setPrimaryPayoutMethodAction(methodId)
          : await deletePayoutMethodAction(methodId);
      if (!result.success) {
        setFeedback({ type: "error", message: result.error || "Perubahan gagal disimpan." });
        return;
      }
      setFeedback({
        type: "success",
        message: action === "PRIMARY" ? "Rekening utama diperbarui." : "Metode pencairan dihapus.",
      });
      router.refresh();
    });
  }

  return (
    <section className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-lg font-bold text-ink">Metode Pencairan</h2>
          <p className="mt-1 text-sm text-ink-muted">Rekening tersimpan akan tersedia saat mengajukan penarikan saldo.</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant={isAdding ? "ghost" : "primary"}
          onClick={() => {
            setIsAdding((current) => !current);
            setFeedback(null);
          }}
          disabled={isPending || (!isAdding && methods.length >= 5)}
        >
          {isAdding ? <X size={14} /> : <Plus size={14} />}
          {isAdding ? "Tutup" : "Tambah"}
        </Button>
      </div>

      {isAdding && (
        <form ref={formRef} onSubmit={submitMethod} className="mt-5 grid gap-4 rounded-xl bg-canvas p-4 md:grid-cols-2">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Bank atau e-wallet
            <input
              name="provider"
              required
              minLength={2}
              maxLength={80}
              list="settings-payout-providers"
              placeholder="Contoh: BCA atau DANA"
              className="rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
            <datalist id="settings-payout-providers">
              <option value="BCA" />
              <option value="BRI" />
              <option value="BNI" />
              <option value="Bank Mandiri" />
              <option value="DANA" />
              <option value="GoPay" />
              <option value="OVO" />
            </datalist>
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Nama pemilik rekening
            <input
              name="accountName"
              required
              minLength={2}
              maxLength={120}
              autoComplete="name"
              className="rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Nomor rekening/e-wallet
            <input
              name="accountNumber"
              required
              minLength={6}
              maxLength={40}
              inputMode="numeric"
              className="rounded-lg border border-hairline bg-card px-4 py-2.5 text-sm outline-none focus:border-brand"
            />
          </label>
          <label className="flex items-center gap-2 self-end pb-3 text-sm font-medium text-ink">
            <input name="isPrimary" type="checkbox" className="h-4 w-4 accent-brand" />
            Jadikan rekening utama
          </label>
          <div className="md:col-span-2">
            <Button type="submit" isLoading={isPending}>Simpan Metode</Button>
          </div>
        </form>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {methods.length === 0 ? (
          <p className="rounded-xl border border-dashed border-hairline p-8 text-center text-sm text-ink-muted">
            Belum ada metode pencairan. Tambahkan rekening sebelum menarik saldo.
          </p>
        ) : (
          methods.map((method) => (
            <div key={method.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-hairline px-5 py-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-canvas text-brand">
                  <CreditCard size={19} />
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-body text-sm font-semibold text-ink">{method.name}</p>
                    {method.isPrimary && (
                      <span className="rounded-full bg-brand-soft px-2.5 py-0.5 text-xs font-semibold text-brand">Utama</span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink-muted">{method.detailLine}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {!method.isPrimary && (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => void mutateMethod("PRIMARY", method.id)}
                    aria-label={`Jadikan ${method.name} rekening utama`}
                    className="inline-flex h-9 items-center gap-1.5 rounded-full border border-hairline px-3 text-xs font-semibold text-ink hover:border-brand hover:text-brand disabled:opacity-50"
                  >
                    <Star size={14} /> Utamakan
                  </button>
                )}
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => void mutateMethod("DELETE", method.id)}
                  aria-label={`Hapus ${method.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-danger hover:border-danger disabled:opacity-50"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {methods.length >= 5 && <p className="mt-3 text-xs text-ink-muted">Maksimal 5 metode pencairan per akun.</p>}
      {feedback && (
        <p role={feedback.type === "error" ? "alert" : "status"} className={`mt-4 rounded-lg p-3 text-sm font-semibold ${feedback.type === "error" ? "bg-danger-soft text-danger" : "bg-success/10 text-success"}`}>
          {feedback.message}
        </p>
      )}
    </section>
  );
}
