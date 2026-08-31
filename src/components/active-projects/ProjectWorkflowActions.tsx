"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  approveProjectResultAction,
  submitProjectResultAction,
} from "@/app/actions/project-lifecycle";
import type { ActiveProject } from "@/types/active-project";

export default function ProjectWorkflowActions({ project }: { project: ActiveProject }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function submitResult(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await submitProjectResultAction(formData);
      if (!result.success) {
        setError(result.error || "Hasil proyek gagal dikirim.");
        return;
      }
      router.refresh();
    });
  }

  function approveResult() {
    if (!window.confirm("Setujui hasil ini? Dana akan langsung masuk ke saldo talent.")) return;
    setError(null);
    startTransition(async () => {
      const result = await approveProjectResultAction(project.id);
      if (!result.success) {
        setError(result.error || "Hasil proyek gagal disetujui.");
        return;
      }
      router.refresh();
    });
  }

  if (!project.workflowAction && !project.submission) return null;

  return (
    <div className="mt-5 border-t border-hairline pt-5">
      {project.workflowAction === "SUBMIT_RESULT" && (
        <form action={submitResult} className="space-y-3 rounded-xl bg-canvas p-4">
          <input type="hidden" name="projectId" value={project.id} />
          <h4 className="font-display text-sm font-black text-ink">Kirim hasil pekerjaan</h4>
          <input
            name="resultUrl"
            type="url"
            placeholder="https://drive.google.com/... (opsional)"
            className="w-full rounded-lg border border-hairline bg-card px-4 py-3 text-sm text-ink outline-none focus:border-brand"
          />
          <textarea
            name="notes"
            required
            minLength={20}
            maxLength={3000}
            rows={4}
            placeholder="Jelaskan hasil yang sudah diselesaikan dan cara UMKM memeriksanya."
            className="w-full resize-y rounded-lg border border-hairline bg-card px-4 py-3 text-sm text-ink outline-none focus:border-brand"
          />
          <button
            type="submit"
            disabled={isPending}
            className="rounded-full bg-brand px-5 py-2.5 text-xs font-display font-bold uppercase text-white disabled:opacity-60"
          >
            {isPending ? "Mengirim..." : "Kirim untuk Review"}
          </button>
        </form>
      )}

      {project.submission && (
        <div className="rounded-xl bg-canvas p-4">
          <h4 className="font-display text-sm font-black text-ink">Hasil dari talent</h4>
          <p className="mt-2 whitespace-pre-line text-sm leading-6 text-ink-muted">{project.submission.notes}</p>
          {project.submission.resultUrl && (
            <a
              href={project.submission.resultUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-block text-sm font-bold text-brand underline"
            >
              Buka tautan hasil
            </a>
          )}
          {project.workflowAction === "APPROVE_RESULT" && (
            <button
              type="button"
              disabled={isPending}
              onClick={approveResult}
              className="mt-4 block rounded-full bg-success px-5 py-2.5 text-xs font-display font-bold uppercase text-white disabled:opacity-60"
            >
              {isPending ? "Melepas saldo..." : "Setujui & Lepas Saldo"}
            </button>
          )}
        </div>
      )}
      {error && <p role="alert" className="mt-3 rounded-lg bg-danger-soft p-3 text-sm font-semibold text-danger">{error}</p>}
    </div>
  );
}
