"use client";

import { useActionState } from "react";
import { createProposalAction } from "@/app/actions/proposals";
import Button from "@/components/ui/Button";

export default function ProposalForm({
  projectId,
  budgetLabel,
}: {
  projectId: string;
  budgetLabel: string;
}) {
  const [state, formAction, isPending] = useActionState(
    createProposalAction,
    {},
  );

  return (
    <form action={formAction} className="mt-5 flex flex-col gap-4">
      <input type="hidden" name="projectId" value={projectId} />
      <label className="flex flex-col gap-2 text-sm font-bold text-ink">
        Proposal Anda
        <textarea
          name="coverLetter"
          required
          minLength={50}
          maxLength={2000}
          rows={7}
          placeholder="Jelaskan pengalaman yang relevan, pendekatan pengerjaan, dan alasan Anda cocok untuk project ini."
          className="resize-y rounded-xl border border-hairline bg-white px-4 py-3 font-body text-sm font-normal text-ink outline-none focus:border-brand focus:ring-2 focus:ring-brand/20"
        />
        <span className="font-normal text-ink-muted">
          Minimal 50 karakter, maksimal 2.000 karakter.
        </span>
        {state.fieldErrors?.coverLetter?.[0] && (
          <span className="font-normal text-danger">
            {state.fieldErrors.coverLetter[0]}
          </span>
        )}
      </label>

      <label className="flex cursor-pointer items-start gap-3 rounded-xl bg-canvas p-4 text-sm text-ink">
        <input
          type="checkbox"
          name="budgetAgreement"
          required
          className="mt-0.5 h-4 w-4 accent-brand"
        />
        <span>
          Saya menyetujui budget tetap project sebesar <strong>{budgetLabel}</strong>.
        </span>
      </label>
      {state.fieldErrors?.budgetAgreement?.[0] && (
        <span className="text-sm text-danger">
          {state.fieldErrors.budgetAgreement[0]}
        </span>
      )}

      {state.error && (
        <p
          role="alert"
          className="rounded-lg border border-danger/20 bg-danger-soft px-4 py-3 text-sm font-semibold text-danger"
        >
          {state.error}
        </p>
      )}

      <Button
        type="submit"
        isLoading={isPending}
        disabled={isPending}
        fullWidth
      >
        Kirim Proposal
      </Button>
    </form>
  );
}
