import Button from "@/components/ui/Button";

export default function UserListPagination({ summary }: { summary: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <p className="text-sm text-ink-muted">{summary}</p>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          Sebelumnya
        </Button>
        <Button variant="primary" size="sm" className="w-9 px-0">
          1
        </Button>
        <Button variant="ghost" size="sm" className="w-9 px-0">
          2
        </Button>
        <Button variant="ghost" size="sm">
          Berikutnya
        </Button>
      </div>
    </div>
  );
}
