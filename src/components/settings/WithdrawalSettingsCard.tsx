"use client";

import Link from "next/link";
import { BanknoteArrowDown, ShieldCheck } from "lucide-react";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function WithdrawalSettingsCard({
  balanceLabel,
  hasPayoutMethod,
}: {
  balanceLabel: string;
  hasPayoutMethod: boolean;
}) {
  const { dict } = usePreferences();

  return (
    <section className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <BanknoteArrowDown size={21} className="text-brand" />
            <h2 className="font-display text-lg font-bold text-ink">{dict.settingsCards?.payments?.manualWithdrawalTitle || "Penarikan Saldo Manual"}</h2>
          </div>
          <p className="mt-2 text-sm text-ink-muted">
            {dict.withdrawals?.availableBalance || "Saldo tersedia"}: <strong className="text-ink">{balanceLabel}</strong>. {dict.withdrawals?.minimumWithdrawalNote || "Minimum penarikan Rp10.000."}
          </p>
          <p className="mt-2 flex items-center gap-1.5 text-xs text-ink-muted">
            <ShieldCheck size={15} className="text-success" />
            {dict.settingsCards?.payments?.adminCheckNote || "Permintaan diperiksa dan ditransfer manual oleh Admin."}
          </p>
        </div>
        <Link
          href="/dashboard/withdrawals"
          aria-disabled={!hasPayoutMethod}
          className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
            hasPayoutMethod
              ? "bg-brand text-white hover:opacity-90"
              : "pointer-events-none bg-canvas text-ink-muted opacity-60"
          }`}
        >
          {hasPayoutMethod ? (dict.settingsCards?.payments?.withdrawButton || "Tarik Saldo") : (dict.settingsCards?.payments?.addAccountFirst || "Tambahkan Rekening Dahulu")}
        </Link>
      </div>
    </section>
  );
}
