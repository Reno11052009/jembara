import { LucideIcon } from "lucide-react";

export interface DashboardStat {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
}

export interface RecommendedProject {
  id: string;
  title: string;
  companyName: string;
  matchPercent: number;
  budgetLabel: string;
  deadlineLabel: string;
  tags: string[];
  postedLabel: string;
}

export interface RunningActivity {
  id: string;
  title: string;
  clientName: string;
  status: "in_progress" | "review" | "completed";
  progressPercent?: number;
}

export interface MessagePreview {
  id: string;
  senderName: string;
  timeLabel: string;
  snippet: string;
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: string;
}

export interface DashboardNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  href: string | null;
  isRead: boolean;
  createdAtLabel: string;
}

export interface ManagedProject {
  id: string;
  title: string;
  companyName: string;
  status: string;
  proposalCount: number;
  budgetLabel: string;
  deadlineLabel: string;
  tags: string[];
  selectedStudentName: string | null;
}

export interface DashboardData {
  role: "STUDENT" | "UMKM" | "ADMIN";
  userName: string;
  avatarUrl: string;
  profileCompletionPercent: number;
  metrics: DashboardMetric[];
  recommendedProjects: RecommendedProject[];
  managedProjects: ManagedProject[];
  runningActivities: RunningActivity[];
  notifications: DashboardNotification[];
  projectSectionTitle: string;
  projectSectionEmptyMessage: string;
}
