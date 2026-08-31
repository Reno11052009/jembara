import type { ActiveProjectMetric } from "@/types/active-project";

interface MonthlyActivityCardProps {
  title: string;
  metrics: ActiveProjectMetric[];
}

const toneStyles = {
  default: "text-ink",
  brand: "text-brand",
  success: "text-success",
};

export default function MonthlyActivityCard({
  title,
  metrics,
}: MonthlyActivityCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-5">
      <h3 className="font-display text-sm font-black text-ink">{title}</h3>
      <div className="mt-4 flex flex-col gap-3.5">
        {metrics.map((metric) => (
          <div key={metric.id} className="flex items-center justify-between gap-4">
            <p className="font-body text-sm text-ink-muted">{metric.label}</p>
            <p
              className={`text-right font-display text-sm font-black ${
                toneStyles[metric.tone ?? "default"]
              }`}
            >
              {metric.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
