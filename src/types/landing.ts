import { LucideIcon } from "lucide-react";

export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export interface ServiceCategory {
  icon: React.ElementType;
  title: string;
  activeProjectsLabel: string;
}

export interface Talent {
  id: string;
  name: string;
  school: string;
  specialty: string;
  rating: number;
  completedLabel: string;
  skills: string[];
}

export type ProjectBadge = "Premium" | "Urgent" | "Popular";

export interface LandingProject {
  id: string;
  clientName: string;
  badge?: ProjectBadge;
  title: string;
  budgetLabel: string;
  durationLabel: string;
  tags: string[];
}

export interface StatItem {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  role: string;
}