import { ShieldCheck, Wallet } from "lucide-react";
import Link from "next/link";

export default function WalletBalanceCard({
  balanceLabel,
  canWithdraw,
}: {
  balanceLabel: string;
  canWithdraw: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-5 rounded-2xl bg-gray p-6 text-white">
      <div className="flex items-center gap-4">
        <div className="rounded-xl bg-white/10 p-3 text-brand">
          <Wallet size={26} />
        </div>
        <div>
          <p className="text-sm text-slate-300">Saldo Jembara tersedia</p>
          <p className="mt-1 font-display text-2xl font-black">{balanceLabel}</p>
        </div>
      </div>
      <div className="flex flex-col items-start gap-3 sm:items-end">
        <p className="flex max-w-sm items-center gap-2 text-sm text-slate-300">
          <ShieldCheck size={18} className="shrink-0 text-success" />
          Saldo bertambah otomatis setelah UMKM menyetujui hasil proyek.
        </p>
        {canWithdraw && (
          <Link
            href="/dashboard/withdrawals"
            className="rounded-full bg-brand px-5 py-2.5 text-xs font-display font-bold uppercase text-white transition hover:opacity-90"
          >
            Tarik Saldo
          </Link>
        )}
      </div>
    </div>
  );
}
