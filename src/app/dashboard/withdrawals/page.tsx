import DashboardPageHeader from "@/components/layout/DashboardPageHeader";
import AdminWithdrawalList from "@/components/withdrawals/AdminWithdrawalList";
import WithdrawalHistory from "@/components/withdrawals/WithdrawalHistory";
import WithdrawalRequestForm from "@/components/withdrawals/WithdrawalRequestForm";
import { getWithdrawalPageData } from "@/lib/withdrawals";

export const instant = false;

export default async function WithdrawalsPage() {
  const data = await getWithdrawalPageData();

  if (data.role === "ADMIN") {
    return (
      <>
        <DashboardPageHeader
          title="Penarikan Saldo"
          subtitle={`Proses transfer manual Student. ${data.pendingCount} permintaan menunggu.`}
        />
        <AdminWithdrawalList requests={data.requests} />
      </>
    );
  }

  return (
    <>
      <DashboardPageHeader
        title="Penarikan Saldo"
        subtitle="Ajukan pencairan saldo Jembara ke rekening atau e-wallet Anda."
      />
      <div className="flex flex-col gap-6">
        <WithdrawalRequestForm
          balance={data.balance}
          balanceLabel={data.balanceLabel}
          payoutMethods={data.payoutMethods}
        />
        <WithdrawalHistory requests={data.requests} />
      </div>
    </>
  );
}
