"use client";

import { useState } from "react";
import { CreditCard, Pencil, Trash2, Plus } from "lucide-react";
import { mockPaymentMethods } from "@/lib/mock-payment-settings";
import Input from "@/components/ui/Input";
import type { PaymentMethod } from "@/types/settings";

export default function PaymentMethodsCard() {
  const [methods, setMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
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
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Metode Pembayaran
      </h2>

      <div className="flex flex-col gap-4 mb-5">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex items-center justify-between gap-4 rounded-lg border border-[#ECECEC] px-5 py-4"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center shrink-0">
                <CreditCard size={18} className="text-neutral-700" />
              </div>
              <div className="min-w-0">
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

                {editingId === method.id ? (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      autoFocus
                      value={editDraft}
                      onChange={(e) => setEditDraft(e.target.value)}
                      className="font-body text-xs text-neutral-900 border border-orange-300 rounded-md px-2 py-1 outline-none focus:border-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => saveEdit(method.id)}
                      className="font-body text-xs font-semibold text-orange-600 hover:underline"
                    >
                      Simpan
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="font-body text-xs text-neutral-400 hover:underline"
                    >
                      Batal
                    </button>
                  </div>
                ) : (
                  <p className="font-body text-xs text-neutral-500">
                    {method.detailLine}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => startEdit(method)}
                className="w-8 h-8 rounded-md border border-[#ECECEC] flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors"
              >
                <Pencil size={14} />
              </button>
              <button
                type="button"
                onClick={() => removeMethod(method.id)}
                className="w-8 h-8 rounded-md border border-[#ECECEC] flex items-center justify-center text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        {methods.length === 0 && (
          <p className="font-body text-sm text-neutral-400 text-center py-4">
            Belum ada metode pembayaran.
          </p>
        )}
      </div>

      {isAdding ? (
        <div className="flex flex-col gap-3 rounded-lg border border-[#ECECEC] p-4 mb-2">
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
              className="font-body text-sm font-semibold text-neutral-600 hover:bg-neutral-50 transition-colors rounded-full px-5 py-2"
            >
              Batal
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="inline-flex items-center gap-1.5 font-body text-sm font-semibold text-neutral-900 border border-neutral-300 rounded-full px-5 py-2.5 hover:bg-neutral-50 transition-colors"
        >
          <Plus size={14} />
          Tambah Metode Penarikan
        </button>
      )}
    </section>
  );
}