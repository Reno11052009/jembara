export interface Project {
  id: string;
  title: string;
  companyName: string;
  description: string;
  tags: string[];
  budgetLabel: string;
  deadlineLabel: string;
  locationLabel: string;
  skillMatchPercent: number;
  skillMatchReason: string;
}

export type ProjectSort = "recommended" | "latest" | "deadline" | "budget";

export type ProjectBudgetFilter = "under-1m" | "1m-3m" | "3m-5m" | "over-5m";

export interface FindProjectFilters {
  query: string;
  skill: string;
  location: string;
  budget: ProjectBudgetFilter | "";
  sort: ProjectSort;
  page: number;
}

export interface ProjectFilterOption {
  label: string;
  value: string;
}

export interface FindProjectsData {
  projects: Project[];
  filters: FindProjectFilters;
  skillOptions: ProjectFilterOption[];
  locationOptions: ProjectFilterOption[];
  totalProjects: number;
  totalPages: number;
  currentPage: number;
  hasStudentSkills: boolean;
  viewerRole: "STUDENT" | "UMKM" | "ADMIN";
  canApply: boolean;
}
