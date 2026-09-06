import WithdrawalsView from "@/components/withdrawals/WithdrawalsView";
import { getWithdrawalPageData } from "@/lib/withdrawals";

export const instant = false;

export default async function WithdrawalsPage() {
  const data = await getWithdrawalPageData();

  return <WithdrawalsView data={data} />;
}
