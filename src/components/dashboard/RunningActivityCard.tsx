import { RunningActivity } from "@/types/dashboard";

interface RunningActivityCardProps {
  activities: RunningActivity[];
}

export default function RunningActivityCard({
  activities,
}: RunningActivityCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <h3 className="text-lg font-display font-black text-ink">Aktivitas Project Berjalan</h3>

      <div className="mt-4 flex flex-col gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="rounded-lg bg-canvas p-4">
            <div className="flex items-start justify-between gap-2">
              <p className="truncate text-base font-display font-black text-ink">
                {activity.title}
              </p>
              <span
                className={`shrink-0 rounded-full px-2 py-0.5 text-[13px] font-medium ${
                  activity.status === "completed"
                    ? "bg-success/10 text-success"
                    : "bg-brand-soft text-brand"
                }`}
              >
                {activity.status === "completed" ? "Completed" : "In Progress"}
              </span>
            </div>
            <p className="mt-0.5 text-sm text-ink-muted">{activity.clientName}</p>
            {typeof activity.progressPercent === "number" && (
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-hairline">
                <div
                  className={`h-full rounded-full ${
                    activity.status === "completed" ? "bg-success" : "bg-brand"
                  }`}
                  style={{ width: `${activity.progressPercent}%` }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
