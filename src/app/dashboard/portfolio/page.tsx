import PageHeader from "@/components/layout/PageHeader";
import PortfolioStatsGrid from "@/components/portofolio/PortfolioStatsGrid";
import PortfolioProjectSection from "@/components/portofolio/PortfolioProjectSection";
import SkillEndorsementSection from "@/components/portofolio/SkillEndorsementSection";
import TestimonialSection from "@/components/portofolio/TestimonialSection";
import { getPortfolioData } from "@/lib/portfolio";

export const instant = false;

export default async function PortfolioPage() {
  const data = await getPortfolioData();

  return (
    <>
      <PageHeader
        title="Portfolio"
        subtitle="Tampilkan karya terbaikmu kepada klien potensial."
      />

      <div className="flex flex-col gap-8">
        <PortfolioStatsGrid summary={data.summary} />
        <PortfolioProjectSection projects={data.projects} />
        <SkillEndorsementSection skills={data.skills} />
        <TestimonialSection testimonials={data.testimonials} />
      </div>
    </>
  );
}
