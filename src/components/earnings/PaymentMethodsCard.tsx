"use client";

import { useState } from "react";
import { CreditCard, Pencil, Trash2, Plus } from "lucide-react";
import { mockPaymentMethods, mockPaymentMethodsUmkm } from "@/lib/mock-payment-settings";
import Input from "@/components/ui/Input";
import type { PaymentMethod } from "@/types/settings";

export default function PaymentMethodsCard({ isUmkm = false }: { isUmkm?: boolean }) {
  const [methods, setMethods] = useState<PaymentMethod[]>(
    isUmkm ? mockPaymentMethodsUmkm : mockPaymentMethods
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDetail, setNewDetail] = useState("");

  const removeMethod = (id: string) => {
    setMethods((prev) => prev.filter((method) => method.id !== id));
  };

  const startEdit = (method: PaymentMethod) => {
    setEditingId(method.id);
    setEditDraft(method.detailLine);
  };

  const saveEdit = (id: string) => {
    setMethods((prev) =>
      prev.map((method) =>
        method.id === id ? { ...method, detailLine: editDraft } : method
      )
    );
    setEditingId(null);
  };

  const addMethod = () => {
    if (!newName.trim()) return;
    setMethods((prev) => [
      ...prev,
      {
        id: `payment-method-${Date.now()}`,
        name: newName.trim(),
        detailLine: newDetail.trim() || "-",
        isPrimary: false,
      },
    ]);
    setNewName("");
    setNewDetail("");
    setIsAdding(false);
  };

  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-hairline bg-white dark:bg-card p-6">
      <div className="flex items-center justify-between gap-4 mb-5">
        <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink">
          Metode Pembayaran
        </h2>
        {isUmkm && !isAdding && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex shrink-0 items-center gap-1.5 font-body text-sm font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/15 rounded-full px-4 py-2 hover:bg-orange-100 dark:hover:bg-orange-500/25 transition-colors"
          >
            <Plus size={14} />
            Tambah Metode
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4 mb-5">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-[#ECECEC] dark:border-hairline px-5 py-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-md bg-neutral-100 dark:bg-surface flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-neutral-700 dark:text-ink-muted" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink">
                    {method.name}
                  </p>
                  {method.isPrimary && (
                    <span className="font-body text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-500/15 rounded-full px-2.5 py-0.5">
                      Utama
                    </span>
                  )}
                </div>

                {editingId === method.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      autoFocus
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      className="font-body text-xs text-neutral-900 dark:text-ink border border-orange-300 rounded-md px-2 py-1 outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(method.id)}
                      className="font-body text-xs font-semibold text-orange-600 dark:text-orange-400 hover:underline"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="font-body text-xs text-neutral-400 dark:text-ink-muted hover:underline"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <p className="font-body text-xs text-neutral-500 dark:text-ink-muted">
                    {method.detailLine}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(method)}
                className="w-8 h-8 rounded-md border border-[#ECECEC] dark:border-hairline flex items-center justify-center text-neutral-600 dark:text-ink-muted hover:bg-neutral-50 dark:hover:bg-void transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeMethod(method.id)}
                className="w-8 h-8 rounded-md border border-[#ECECEC] dark:border-hairline flex items-center justify-center text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/15 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {methods.length === 0 && (
          <p className="font-body text-sm text-neutral-400 dark:text-ink-muted text-center py-4">
            Belum ada metode pembayaran.
          </p>
        )}
      </div>

      {isAdding ? (
        <div className="flex flex-col gap-3 rounded-lg border border-[#ECECEC] dark:border-hairline p-4 mb-2">
          <Input
            label="Nama Metode"
            placeholder="mis. Bank Mandiri"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Input
            label="Detail"
            placeholder="mis. **** 1234"
            value={newDetail}
            onChange={(e) => setNewDetail(e.target.value)}
          />
          <div className="flex gap-2">
            <button
              type="button"
              onClick={addMethod}
              className="font-body text-sm font-semibold text-white bg-orange-500 hover:bg-orange-600 transition-colors rounded-full px-5 py-2"
            >
              Simpan
            </button>
            <button
              type="button"
              onClick={() => {
                setIsAdding(false);
                setNewName("");
                setNewDetail("");
              }}
              className="font-body text-sm font-semibold text-neutral-600 dark:text-ink-muted hover:bg-neutral-50 dark:hover:bg-void transition-colors rounded-full px-5 py-2"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        !isUmkm && (
          <button
            type="button"
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-neutral-900 dark:text-ink border border-neutral-300 rounded-full px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-void transition-colors"
          >
            <Plus size={14} />
            Tambah Metode Penarikan
          </button>
        )
      )}
    </section>
  );
}