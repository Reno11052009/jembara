interface MaintenanceProgressBarProps {
  percent: number;
}

export default function MaintenanceProgressBar({
  percent,
}: MaintenanceProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));

  return (
    <div
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      className="h-2 w-full overflow-hidden rounded-full bg-hairline"
    >
      <div
        className="h-full rounded-full bg-brand transition-all duration-500"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}