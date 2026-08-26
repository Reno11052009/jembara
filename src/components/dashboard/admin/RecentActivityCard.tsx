import ActivityListItem from "@/components/dashboard/admin/ActivityListItem";
import { PlatformActivity } from "@/types/admin-dashboard";

export default function RecentActivityCard({ activities }: { activities: PlatformActivity[] }) {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-hairline bg-card p-6">
      <h2 className="font-display text-lg font-black text-ink">Aktivitas Terbaru Platform</h2>
      <div className="flex flex-col gap-3">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <ActivityListItem key={activity.id} activity={activity} />
          ))
        ) : (
          <p className="rounded-xl bg-canvas p-6 text-center text-sm text-ink-muted">
            Belum ada aktivitas platform.
          </p>
        )}
      </div>
    </div>
  );
}
