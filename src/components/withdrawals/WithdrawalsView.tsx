"use client";

import PageHeader from "@/components/layout/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import WithdrawalRequestForm from "@/components/withdrawals/WithdrawalRequestForm";
import WithdrawalHistory from "@/components/withdrawals/WithdrawalHistory";
import AdminWithdrawalList from "@/components/withdrawals/AdminWithdrawalList";
import type { WithdrawalPageData } from "@/types/withdrawal";

interface WithdrawalsViewProps {
  data: WithdrawalPageData;
}

export default function WithdrawalsView({ data }: WithdrawalsViewProps) {
  const { dict, language } = usePreferences();

  if (data.role === "ADMIN") {
    const adminSubtitle =
      language === "en"
        ? `Manual student transfer process. ${data.pendingCount} pending request(s).`
        : language === "ja"
        ? `手動学生送金プロセス。 ${data.pendingCount} 件の保留中のリクエスト。`
        : `Proses transfer manual Student. ${data.pendingCount} permintaan menunggu.`;

    return (
      <>
        <PageHeader
          title={dict.withdrawals.pageTitle}
          subtitle={adminSubtitle}
        />
        <AdminWithdrawalList requests={data.requests} />
      </>
    );
  }

  return (
    <>
      <PageHeader
        title={dict.withdrawals.pageTitle}
        subtitle={dict.withdrawals.pageSubtitle}
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
