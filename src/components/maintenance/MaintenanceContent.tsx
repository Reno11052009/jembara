import { Wrench } from "lucide-react";
import MaintenanceProgressBar from "@/components/maintenance/MaintenanceProgressBar";

interface MaintenanceContentProps {
  title: string;
  description: string;
  progressPercent: number;
  footnote: string;
}

export default function MaintenanceContent({
  title,
  description,
  progressPercent,
  footnote,
}: MaintenanceContentProps) {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-soft">
        <Wrench size={32} className="text-brand" />
      </div>

      <h1 className="mt-6 font-display text-2xl font-black text-ink">{title}</h1>
      <p className="mt-3 font-body text-sm text-ink-muted">{description}</p>

      <div className="mt-6 w-full max-w-xs">
        <MaintenanceProgressBar percent={progressPercent} />
      </div>

      <p className="mt-3 font-display text-sm font-black text-brand">{footnote}</p>
    </div>
  );
}