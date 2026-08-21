"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";

export default function AutoWithdrawalCard() {
  const [minWithdrawal, setMinWithdrawal] = useState("Rp 500.000");

  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Pengaturan Penarikan Otomatis
      </h2>

      <div className="mb-5">
        <Input
          type="text"
          label="MINIMAL JUMLAH PENARIKAN"
          value={minWithdrawal}
          onChange={(e) => setMinWithdrawal(e.target.value)}
        />
      </div>

      <div className="flex items-start justify-between gap-6 pt-5 border-t border-[#ECECEC]">
        <div>
          <p className="font-body text-sm font-semibold text-neutral-900 mb-1">
            Pencairan Otomatis Mingguan
          </p>
          <p className="font-body text-sm text-neutral-500 max-w-xl">
            Setiap hari Jumat, saldo SkillBridge kamu akan ditarik otomatis ke
            rekening utama jika memenuhi batas minimal.
          </p>
        </div>

        <div className="relative shrink-0 w-12 h-7 rounded-full bg-neutral-300">
          <span className="absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow" />
        </div>
      </div>
    </section>
  );
}