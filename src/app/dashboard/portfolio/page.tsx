import PortfolioView from "@/components/portofolio/PortfolioView";
import { getPortfolioData } from "@/lib/portfolio";

export const instant = false;

export default async function PortfolioPage() {
  const data = await getPortfolioData();

  return <PortfolioView data={data} />;
}
