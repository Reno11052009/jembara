"use client";

import {
  useActionState,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import { FileText, Upload, X } from "lucide-react";
import { createProposalAction } from "@/app/actions/proposals";
import Button from "@/components/ui/Button";
import Swal from "sweetalert2";

const ACCEPTED_CV_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
const MAX_CV_SIZE_BYTES = 5 * 1024 * 1024;

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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

  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvError, setCvError] = useState("");
  const cvInputRef = useRef<HTMLInputElement>(null);

  function handleCvChange(event: ChangeEvent<HTMLInputElement>) {
  const file = event.target.files?.[0];
  if (!file) return;

  if (!ACCEPTED_CV_TYPES.includes(file.type)) {
    event.target.value = "";
    setCvError("Format file harus PDF, DOC, atau DOCX.");

    Swal.fire({
      icon: "error",
      title: "Format file tidak didukung",
      text: "Silakan unggah file CV dalam format PDF, DOC, atau DOCX.",
      confirmButtonColor: "#FF6B35",
    });

    return;
  }

  if (file.size > MAX_CV_SIZE_BYTES) {
    event.target.value = "";
    setCvError("Ukuran file maksimal 5 MB.");

    Swal.fire({
  icon: "success",
  title: "CV siap diunggah",
  text: `${file.name} dipilih dan siap dikirim bersama proposal.`,
  confirmButtonColor: "#FF6B35",
  timer: 1500,
  timerProgressBar: true,
});

    return;
  }

  setCvError("");
  setCvFile(file);
}

  function removeCvFile() {
    setCvFile(null);
    setCvError("");
    if (cvInputRef.current) cvInputRef.current.value = "";
  }

  return (
    <form action={formAction} noValidate className="mt-5 flex flex-col gap-4">
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

      {/* Upload CV */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-bold text-ink">CV (opsional)</label>
        <input
          ref={cvInputRef}
          type="file"
          name="cv"
          id="cv-upload"
          accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          onChange={handleCvChange}
          className="hidden"
        />
        {!cvFile ? (
          <label
            htmlFor="cv-upload"
            className="flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border border-dashed border-hairline bg-canvas px-4 py-6 text-center text-sm text-ink-muted transition hover:border-brand hover:text-brand"
          >
            <Upload size={18} />
            <span className="font-semibold">Klik untuk pilih file CV</span>
            <span className="text-xs">PDF, DOC, atau DOCX — maksimal 5 MB</span>
          </label>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-hairline bg-canvas px-4 py-3">
            <div className="flex min-w-0 items-center gap-2">
              <FileText size={18} className="shrink-0 text-brand" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-ink">{cvFile.name}</p>
                <p className="text-xs text-ink-muted">{formatFileSize(cvFile.size)}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={removeCvFile}
              aria-label="Hapus file CV"
              className="shrink-0 rounded-full p-1 text-ink-muted transition hover:bg-white hover:text-danger"
            >
              <X size={16} />
            </button>
          </div>
        )}
        {cvError && <span className="text-sm text-danger">{cvError}</span>}
      </div>

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