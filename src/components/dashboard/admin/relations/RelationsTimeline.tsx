import { RelationTimelineStep } from "@/types/admin-relations";

const dotColors = ["bg-success", "bg-success", "bg-ink", "bg-brand"];
const lineColors = ["bg-success", "bg-hairline", "bg-hairline"];

export default function RelationsTimeline({
  projectName,
  steps,
}: {
  projectName: string;
  steps: RelationTimelineStep[];
}) {
  return (
    <div className="px-6 py-5">
      <h3 className="mb-4 font-display text-sm font-black uppercase tracking-wide text-ink">
        Timeline Detil: {projectName}
      </h3>
      <div className="flex items-center">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className="flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 shrink-0 rounded-full ${dotColors[index % dotColors.length]}`}
              />
              <span className="whitespace-nowrap text-sm font-semibold text-ink">
                {step.label}
              </span>
              <span className="whitespace-nowrap text-xs text-ink-muted">({step.date})</span>
            </div>
            {index < steps.length - 1 && (
              <span
                className={`mx-4 h-px w-10 shrink-0 ${lineColors[index % lineColors.length]}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
