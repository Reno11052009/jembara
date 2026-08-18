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
  status: "in_progress" | "completed";
  progressPercent?: number;
}

export interface MessagePreview {
  id: string;
  senderName: string;
  timeLabel: string;
  snippet: string;
}
