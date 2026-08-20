import { Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { PaymentMethod } from "@/types/earnings";
import PaymentMethodRow from "@/components/earnings/PaymentMethodRow";

interface PaymentMethodsCardProps {
  methods: PaymentMethod[];
}

export default function PaymentMethodsCard({ methods }: PaymentMethodsCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <h3 className="font-display text-base font-black text-ink">Metode Pembayaran</h3>
      <div className="mt-4 flex flex-col gap-3">
        {methods.map((method) => (
          <PaymentMethodRow key={method.id} method={method} />
        ))}
      </div>
      <Button variant="outline" className="mt-4 w-full gap-1.5 py-2.5 text-sm">
        <Plus size={14} />
        Tambah Metode
      </Button>
    </div>
  );
}