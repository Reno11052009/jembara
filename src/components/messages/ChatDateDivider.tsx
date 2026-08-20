interface ChatDateDividerProps {
  label: string;
}

export default function ChatDateDivider({ label }: ChatDateDividerProps) {
  return (
    <div className="my-4 flex items-center gap-3 px-4">
      <span className="h-px flex-1 bg-hairline" />
      <p className="whitespace-nowrap text-center font-body text-xs font-medium text-ink-muted">
        {label}
      </p>
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}