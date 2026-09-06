"use client";

import { usePreferences } from "@/contexts/PreferencesContext";

interface ProgressBarProps {
  percent: number;
}

export default function ProgressBar({ percent }: ProgressBarProps) {
  const { dict: t } = usePreferences();

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="font-body text-sm font-semibold text-ink">
          {t.activeProjects.progress.progressTitle}
        </p>
        <p className="font-display text-sm font-black text-brand">{percent}%</p>
      </div>
      <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-hairline">
        <div className="h-full rounded-full bg-brand" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}