import PageHeader from "@/components/layout/PageHeader";
import EarningsStatsGrid from "@/components/earnings/EarningsStatsGrid";
import EarningsChartCard from "@/components/earnings/EarningsChartCard";
import TransactionHistoryCard from "@/components/earnings/TransactionHistoryCard";
import PaymentMethodsCard from "@/components/earnings/PaymentMethodsCard";
import UpcomingWithdrawalCard from "@/components/earnings/UpcomingWithdrawalCard";
import {
  earningsStats,
  earningsChartData,
  transactions,
  paymentMethods,
  upcomingWithdrawal,
} from "@/lib/mock-earnings";

export default function EarningsPage() {
  return (
    <>
      <PageHeader
        title="Earnings"
        subtitle="Pantau pendapatan dan riwayat transaksi kamu."
      />

      <div className="flex flex-col gap-6">
        <EarningsStatsGrid stats={earningsStats} />
        <EarningsChartCard data={earningsChartData} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <TransactionHistoryCard transactions={transactions} />
          </div>
          <div className="flex flex-col gap-6">
            <PaymentMethodsCard methods={paymentMethods} />
            <UpcomingWithdrawalCard withdrawal={upcomingWithdrawal} />
          </div>
        </div>
      </div>
    </>
  );
}