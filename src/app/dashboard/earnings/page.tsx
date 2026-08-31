import PageHeader from "@/components/layout/PageHeader";
import EarningsStatsGrid from "@/components/earnings/EarningsStatsGrid";
import EarningsChartCard from "@/components/earnings/EarningsChartCard";
import TransactionHistoryCard from "@/components/earnings/TransactionHistoryCard";
import { getEarningsData } from "@/lib/earnings";
import WalletBalanceCard from "@/components/earnings/WalletBalanceCard";

export default async function EarningsPage() {
  const { walletBalanceLabel, stats, chartData, transactions } = await getEarningsData();

  return (
    <>
      <PageHeader
        title="Earnings"
        subtitle="Pantau nilai proyek berdasarkan status dan pembaruan terakhir proyek."
      />

      <div className="flex flex-col gap-6">
        <WalletBalanceCard balanceLabel={walletBalanceLabel} />
        <EarningsStatsGrid stats={stats} />
        <EarningsChartCard data={chartData} />

        <TransactionHistoryCard transactions={transactions} />
      </div>
    </>
  );
}
