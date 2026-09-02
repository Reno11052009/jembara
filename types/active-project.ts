export type ActiveProjectStatus = "In Progress" | "In Review" | "Completed";
export type ActiveProjectFilter = "Semua" | ActiveProjectStatus;

export interface ProjectMilestone {
  id: string;
  label: string;
  done: boolean;
}

export interface ActiveProject {
  id: string;
  title: string;
  clientName: string;
  counterpartLabel?: string;
  status: ActiveProjectStatus;
  progressPercent?: number;
  milestones?: ProjectMilestone[];
  budgetLabel: string;
  deadlineLabel: string;
  tags?: string[];
  proposalCount?: number;
  updatedLabel?: string;
  paymentStatus?: string | null;
  workflowAction?: "SUBMIT_RESULT" | "APPROVE_RESULT" | null;
  submission?: {
    notes: string;
    resultUrl: string | null;
  } | null;
}

export interface MonthlyActivityStats {
  activeProjectsLabel: string;
  completedThisMonthLabel: string;
  totalEarningsLabel: string;
  averageRatingLabel: string;
}

export type ActiveProjectsViewerRole = "STUDENT" | "UMKM" | "ADMIN";

export interface ActiveProjectMetric {
  id: string;
  label: string;
  value: string;
  tone?: "default" | "brand" | "success";
}

export interface ActiveProjectsData {
  role: ActiveProjectsViewerRole;
  projects: ActiveProject[];
  tabCounts: Record<ActiveProjectStatus, number>;
  metrics: ActiveProjectMetric[];
  pageTitle: string;
  pageSubtitle: string;
  emptyMessage: string;
  collaborationTip: string;
  activeFilter: ActiveProjectFilter;
  pagination: import("@/types/pagination").PaginationData;
}
