import PageHeader from "@/components/layout/PageHeader";
import EarningsStatsGrid from "@/components/earnings/EarningsStatsGrid";
import EarningsChartCard from "@/components/earnings/EarningsChartCard";
import TransactionHistoryCard from "@/components/earnings/TransactionHistoryCard";
import { getEarningsData } from "@/lib/earnings";
import WalletBalanceCard from "@/components/earnings/WalletBalanceCard";
import ListPagination from "@/components/ui/ListPagination";

export const instant = false;

export default async function EarningsPage({ searchParams }: {
  searchParams: Promise<{ page?: string | string[] }>;
}) {
  const query = await searchParams;
  const { walletBalanceLabel, canWithdraw, stats, chartData, transactions, pagination } =
    await getEarningsData(new Date(), query);

  return (
    <>
      <PageHeader
        title="Earnings"
        subtitle="Pantau nilai proyek berdasarkan status dan pembaruan terakhir proyek."
      />

      <div className="flex flex-col gap-6">
        <WalletBalanceCard balanceLabel={walletBalanceLabel} canWithdraw={canWithdraw} />
        <EarningsStatsGrid stats={stats} />
        <EarningsChartCard data={chartData} />

        <TransactionHistoryCard transactions={transactions} />
        <ListPagination basePath="/dashboard/earnings" pagination={pagination} />
      </div>
    </>
  );
}
