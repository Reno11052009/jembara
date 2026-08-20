import Button from "@/components/ui/Button";
import { UpcomingWithdrawal } from "@/types/earnings";

interface UpcomingWithdrawalCardProps {
  withdrawal: UpcomingWithdrawal;
}

export default function UpcomingWithdrawalCard({
  withdrawal,
}: UpcomingWithdrawalCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <h3 className="font-display text-base font-black text-ink">Penarikan Berikutnya</h3>
      <div className="mt-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-ink-muted">Jumlah</p>
          <p className="font-display text-sm font-black text-ink">
            {withdrawal.amountLabel}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-ink-muted">Tanggal</p>
          <p className="font-display text-sm font-black text-ink">
            {withdrawal.dateLabel}
          </p>
        </div>
        <div className="flex items-center justify-between">
          <p className="font-body text-sm text-ink-muted">Status</p>
          <span className="flex items-center gap-1.5 font-display text-sm font-black text-brand">
            <span className="h-2 w-2 rounded-full bg-brand" />
            {withdrawal.statusLabel}
          </span>
        </div>
      </div>
      <Button variant="primary" className="mt-5 w-full py-3 text-sm">
        Tarik Sekarang
      </Button>
    </div>
  );
}