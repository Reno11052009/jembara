"use client";

import PageHeader from "@/components/layout/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import PortfolioStatsGrid from "@/components/portofolio/PortfolioStatsGrid";
import PortfolioProjectSection from "@/components/portofolio/PortfolioProjectSection";
import SkillEndorsementSection from "@/components/portofolio/SkillEndorsementSection";
import TestimonialSection from "@/components/portofolio/TestimonialSection";
import type { PortfolioData } from "@/types/portfolio";

interface PortfolioViewProps {
  data: PortfolioData;
}

export default function PortfolioView({ data }: PortfolioViewProps) {
  const { dict } = usePreferences();

  return (
    <>
      <PageHeader
        title={dict.portfolio.title}
        subtitle={dict.portfolio.subtitle}
      />

      <div className="flex flex-col gap-8">
        <PortfolioStatsGrid summary={data.summary} />
        <PortfolioProjectSection projects={data.projects} />
        <SkillEndorsementSection skills={data.skills} projects={data.projects} />
        <TestimonialSection testimonials={data.testimonials} />
      </div>
    </>
  );
}
