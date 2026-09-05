export interface PortfolioProject {
  id: string;
  title: string;
  description: string | null;
  link: string | null;
  imageUrl: string | null;
  updatedLabel: string;
}

export interface PortfolioSkill {
  id: string;
  name: string;
  category: string | null;
  isVerified: boolean;
  level: string;
  evidencePortfolioId: string | null;
}

export interface PortfolioTestimonial {
  id: string;
  clientName: string;
  projectTitle: string;
  rating: number;
  quote: string;
}

export interface PortfolioSummary {
  portfolioCount: number;
  completedProjectCount: number;
  averageRating: number;
  verifiedSkillCount: number;
}

export interface PortfolioData {
  projects: PortfolioProject[];
  skills: PortfolioSkill[];
  testimonials: PortfolioTestimonial[];
  summary: PortfolioSummary;
}
