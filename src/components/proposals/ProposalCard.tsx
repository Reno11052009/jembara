import { Flame } from "lucide-react";
import { Proposal } from "@/types/proposal";

interface ProposalCardProps {
  proposal: Proposal;
}

const statusStyles: Record<Proposal["status"], string> = {
  Pending: "bg-brand-soft text-brand",
  Accepted: "bg-success/10 text-success",
  Rejected: "bg-danger-soft text-danger",
};

export default function ProposalCard({ proposal }: ProposalCardProps) {
  return (
    <div className="rounded-xl border border-hairline bg-card p-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-base font-black text-ink">
            {proposal.title}
          </h3>
          <p className="mt-1 font-body text-sm text-ink-muted">
            {proposal.clientName}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-1 whitespace-nowrap rounded-full bg-brand-soft px-3 py-1.5 text-xs font-black font-display leading-none text-brand">
            <Flame size={14} />
            {proposal.matchPercent}% Match
          </span>
          <span
            className={`whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-black font-display leading-none ${statusStyles[proposal.status]}`}
          >
            {proposal.status}
          </span>
        </div>
      </div>

      <p className="mt-3 line-clamp-2 font-body text-sm text-ink-muted">
        {proposal.description}
      </p>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {proposal.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-canvas px-2.5 py-1 text-xs font-body text-ink"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-6">
          <div>
            <p className="font-body text-xs text-ink-muted">Budget</p>
            <p className="mt-0.5 font-display text-sm font-black text-ink">
              {proposal.budgetLabel}
            </p>
          </div>
          <div>
            <p className="font-body text-xs text-ink-muted flex justify-end">Tanggal Pengajuan</p>
            <p className="mt-0.5 font-body text-sm font-bold text-ink">
              {proposal.submittedLabel}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}