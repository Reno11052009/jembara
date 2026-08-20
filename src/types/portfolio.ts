export interface PortfolioProject {
  id: string;
  title: string;
  clientName: string;
  tags: string[];
  rating: number;
  completedLabel: string;
  verified: boolean;
}

export interface SkillEndorsement {
  id: string;
  name: string;
  percent: number;
  endorsementCount: number;
}

export interface PortfolioTestimonial {
  id: string;
  clientName: string;
  rating: number;
  quote: string;
}