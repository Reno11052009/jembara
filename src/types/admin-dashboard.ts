import { LucideIcon } from "lucide-react";

export interface AdminStat {
  id: string;
  label: string;
  value: string;
  subLabel?: string;
  icon: LucideIcon;
}

export interface UserGrowthPoint {
  label: string;
  value: number;
}

export interface AdminQuickAction {
  id: string;
  label: string;
  icon: LucideIcon;
}

export interface PlatformActivity {
  id: string;
  actorName: string;
  title: string;
  subtitle: string;
  timeLabel: string;
}
