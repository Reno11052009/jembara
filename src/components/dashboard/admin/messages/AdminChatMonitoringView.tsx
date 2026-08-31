import { MessageSquare, ShieldAlert, TrendingUp } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";
import AdminStatsGrid from "@/components/dashboard/admin/AdminStatsGrid";
import type { AdminChatMonitoringData } from "@/types/admin-chat-monitoring";

const statIcons = { total: MessageSquare, masuk: TrendingUp, laporan: ShieldAlert };

export default function AdminChatMonitoringView({ data }: { data: AdminChatMonitoringData }) {
  const stats = data.stats.map((stat) => ({ ...stat, icon: statIcons[stat.id as keyof typeof statIcons] ?? MessageSquare }));
  return (
    <><PageHeader title="Monitor Pesan & Komunikasi" subtitle="Pantau statistik komunikasi tanpa membuka percakapan privat yang tidak dilaporkan." userName={data.adminName} avatarUrl={data.adminAvatarUrl} /><div className="flex flex-col gap-6"><AdminStatsGrid stats={stats} /><div className="rounded-xl border border-dashed border-hairline bg-card px-6 py-12 text-center"><h2 className="font-display text-lg font-black text-ink">Moderasi berbasis laporan belum tersedia</h2><p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-ink-muted">Statistik di atas berasal dari database. Isi percakapan tidak ditampilkan sampai model laporan, status penanganan, dan audit moderasi tersedia, agar pesan privat tidak terbuka tanpa alasan yang sah.</p></div></div></>
  );
}
