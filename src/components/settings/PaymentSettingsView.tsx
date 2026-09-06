"use client";

import PaymentMethodsCard from "@/components/settings/PaymentMethodsCard";
import TransactionHistoryCard from "@/components/settings/TransactionHistoryCard";
import WithdrawalSettingsCard from "@/components/settings/WithdrawalSettingsCard";
import type { PaymentSettingsData } from "@/types/settings";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function PaymentSettingsView({ data }: { data: PaymentSettingsData }) {
  const { dict } = usePreferences();

  if (!data.canManagePayoutMethods) {
    return (
      <section className="rounded-xl border border-dashed border-hairline bg-card p-10 text-center">
        <h2 className="font-display text-lg font-black text-ink">{dict.settingsCards?.payments?.studentPayoutOnlyTitle || "Pengaturan pencairan khusus Student"}</h2>
        <p className="mt-2 text-sm text-ink-muted">
          {dict.settingsCards?.payments?.studentPayoutOnlyDesc || "UMKM melakukan pembayaran melalui halaman proyek, sedangkan Admin memproses permintaan Student melalui menu Penarikan Saldo."}
        </p>
      </section>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PaymentMethodsCard methods={data.paymentMethods} />
      <WithdrawalSettingsCard
        balanceLabel={data.balanceLabel}
        hasPayoutMethod={data.paymentMethods.length > 0}
      />
      <TransactionHistoryCard transactions={data.transactions} />
    </div>
  );
}