import { PaymentMethod } from "@/types/earnings";

interface PaymentMethodRowProps {
  method: PaymentMethod;
}

export default function PaymentMethodRow({ method }: PaymentMethodRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-canvas p-3">
      <div className="flex items-center gap-3">
        {/* Placeholder logo — ganti dengan next/image logo asli nanti */}
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-[10px] font-display font-black text-white ${method.logoColorClass}`}
        >
          {method.logoInitials.slice(0, 4)}
        </span>
        <div>
          <p className="font-display text-sm font-black text-ink">{method.name}</p>
          <p className="font-body text-xs text-ink-muted">{method.detail}</p>
        </div>
      </div>
      {method.isPrimary && (
        <span className="shrink-0 whitespace-nowrap rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand">
          Primary
        </span>
      )}
    </div>
  );
}