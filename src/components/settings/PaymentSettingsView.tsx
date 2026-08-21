import PaymentMethodsCard from "@/components/settings/PaymentMethodsCard";
import AutoWithdrawalCard from "@/components/settings/AutoWithdrawalCard";
import TransactionHistoryCard from "@/components/settings/TransactionHistoryCard";

export default function PaymentSettingsView() {
  return (
    <div className="flex flex-col gap-6">
      <PaymentMethodsCard />
      <AutoWithdrawalCard />
      <TransactionHistoryCard />
    </div>
  );
}
