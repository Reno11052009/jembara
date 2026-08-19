import { RunningActivity } from "@/types/dashboard";

interface RunningActivityCardProps {
  activities: RunningActivity[];
}

export default function RunningActivityCard({
  activities,
}: RunningActivityCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-2">
      <h3 className="text-sm font-display font-black text-ink">Aktivitas Project Berjalan</h3>

      <div className="mt-2 flex flex-col gap-4">
        {activities.map((activity) => {
          const progress =
            typeof activity.progressPercent === "number"
              ? activity.progressPercent
              : activity.status === "completed"
              ? 100
              : 0;
                
          const isDone = progress >= 100;
                
          const progressColor =
            progress === 0
              ? "bg-[#EAEAEA]"
              : isDone
              ? "bg-success"
              : "bg-brand";
                
          return (
            <div key={activity.id} className="rounded-lg bg-canvas p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="truncate text-sm font-display font-black text-ink">
                  {activity.title}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    activity.status === "completed"
                      ? "bg-success/10 text-success"
                      : "bg-brand-soft text-brand"
                  }`}
                >
                  {activity.status === "completed" ? "Completed" : "In Progress"}
                </span>
              </div>
                
              <div className="mt-2 flex items-center gap-3">
                <p className="shrink-0 text-sm text-ink-muted">{activity.clientName}</p>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-hairline">
                  <div
                    className={`h-full rounded-full ${progressColor}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
