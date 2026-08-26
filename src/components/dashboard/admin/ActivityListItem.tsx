import { PlatformActivity } from "@/types/admin-dashboard";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function ActivityListItem({ activity }: { activity: PlatformActivity }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl bg-canvas p-4">
      <div className="flex items-start gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft font-display text-sm font-black text-brand">
          {getInitials(activity.actorName)}
        </span>
        <div>
          <p className="font-display text-sm font-bold text-ink">{activity.title}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{activity.subtitle}</p>
        </div>
      </div>
      <span className="shrink-0 text-xs text-ink-muted">{activity.timeLabel}</span>
    </div>
  );
}
