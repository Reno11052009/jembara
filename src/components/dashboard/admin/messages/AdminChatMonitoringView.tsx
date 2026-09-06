"use client";

import { MessageSquare, ShieldAlert, TrendingUp } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import type { AdminChatMonitoringData } from "@/types/admin-chat-monitoring";
import { usePreferences } from "@/contexts/PreferencesContext";

const statIcons = { total: MessageSquare, masuk: TrendingUp, laporan: ShieldAlert };

export default function AdminChatMonitoringView({ data }: { data: AdminChatMonitoringData }) {
  const { dict } = usePreferences();
  const stats = data.stats.map((stat) => ({ ...stat, icon: statIcons[stat.id as keyof typeof statIcons] ?? MessageSquare }));
  return (
    <><PageHeader title={dict.admin.chatTitle} subtitle={dict.admin.chatSubtitle} userName={data.adminName} avatarUrl={data.adminAvatarUrl} /><div className="flex flex-col gap-6"><AdminStatsGrid stats={stats} /><div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-12 text-center"><h2 className="font-display text-lg font-black text-ink">{dict.admin.chatTitle}</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-ink-muted">{dict.admin.chatSubtitle}</p></div></div></>
  );
}
