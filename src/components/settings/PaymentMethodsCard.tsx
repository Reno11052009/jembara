import { CreditCard, Pencil, Trash2, Plus } from "lucide-react";
import { mockPaymentMethods } from "@/lib/mock-payment-settings";

export default function PaymentMethodsCard() {
  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Metode Pembayaran
      </h2>

      <div className="flex flex-col gap-4 mb-5">
        {mockPaymentMethods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-[#ECECEC] px-5 py-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-neutral-700" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-body text-sm font-semibold text-neutral-900">
                    {method.name}
                  </p>
                  {method.isPrimary && (
                    <span className="font-body text-xs font-semibold text-orange-600 bg-orange-50 rounded-full px-2.5 py-0.5">
                      Utama
                    </span>
                  )}
                </div>
                <p className="font-body text-xs text-neutral-500">
                  {method.detailLine}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                className="w-8 h-8 rounded-md border border-[#ECECEC] flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                className="w-8 h-8 rounded-md border border-[#ECECEC] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-neutral-900 border border-neutral-300 rounded-full px-5 py-2.5 hover:bg-neutral-50 transition-colors"
      >
        <Plus size={14} />
        Tambah Metode Penarikan
      </button>
    </section>
  );
}
