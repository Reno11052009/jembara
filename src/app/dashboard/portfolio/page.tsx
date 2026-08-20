import PageHeader from "@/components/layout/PageHeader";
import PortfolioStatsGrid from "@/components/portofolio/PortfolioStatsGrid";
import PortfolioProjectSection from "@/components/portofolio/PortfolioProjectSection";
import SkillEndorsementSection from "@/components/portofolio/SkillEndorsementSection";
import TestimonialSection from "@/components/portofolio/TestimonialSection"; 
import {
  portfolioStats,
  portfolioProjects,
  skillEndorsements,
  portfolioTestimonials,
} from "@/lib/mock-portfolio";

export default function PortfolioPage() {
  return (
    <>
      <PageHeader
        title="Portfolio"
        subtitle="Tampilkan karya terbaikmu kepada klien potensial."
      />

      <div className="flex flex-col gap-8">
        <PortfolioStatsGrid stats={portfolioStats} />
        <PortfolioProjectSection projects={portfolioProjects} />
        <SkillEndorsementSection skills={skillEndorsements} />
        <TestimonialSection testimonials={portfolioTestimonials} />
      </div>
    </>
  );
}