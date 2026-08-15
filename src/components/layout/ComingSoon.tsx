import { Construction } from "lucide-react";
import PageHeader from "@/components/layout/PageHeader";

interface ComingSoonProps {
  title: string;
  subtitle: string;
}

export default function ComingSoon({ title, subtitle }: ComingSoonProps) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-hairline bg-card px-6 py-20 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-soft text-brand">
          <Construction size={24} />
        </div>
        <h2 className="mt-4 text-base font-semibold text-ink">
          Halaman ini masih dalam pengerjaan
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Fitur &quot;{title}&quot; akan segera hadir di sini.
        </p>
      </div>
    </>
  );
}
