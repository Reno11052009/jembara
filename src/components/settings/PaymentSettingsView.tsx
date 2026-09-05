import PaymentMethodsCard from "@/components/settings/PaymentMethodsCard";
import AutoWithdrawalCard from "@/components/settings/AutoWithdrawalCard";
import TransactionHistoryCard from "@/components/settings/TransactionHistoryCard";

export default function PaymentSettingsView({ isUmkm = false }: { isUmkm?: boolean }) {
  return (
    <div className="flex flex-col gap-6">
      <PaymentMethodsCard isUmkm={isUmkm} />
      <AutoWithdrawalCard isUmkm={isUmkm} />
      <TransactionHistoryCard isUmkm={isUmkm} />
    </div>
  );
}