export type ActiveProjectStatus = "In Progress" | "In Review" | "Completed";

export interface ProjectMilestone {
  id: string;
  label: string;
  done: boolean;
}

export interface ActiveProject {
  id: string;
  title: string;
  clientName: string;
  status: ActiveProjectStatus;
  progressPercent: number;
  milestones: ProjectMilestone[];
  budgetLabel: string;
  deadlineLabel: string;
}

export interface MonthlyActivityStats {
  activeProjectsLabel: string;
  completedThisMonthLabel: string;
  totalEarningsLabel: string;
  averageRatingLabel: string;
}