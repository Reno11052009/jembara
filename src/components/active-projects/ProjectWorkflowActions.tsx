"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import {
  approveProjectResultAction,
  createProjectReviewAction,
  requestProjectRevisionAction,
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

  function requestRevision(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await requestProjectRevisionAction(formData);
      if (!result.success) {
        setError(result.error || "Permintaan revisi gagal dikirim.");
        return;
      }
      await Swal.fire({ icon: "success", title: "Revisi diminta", text: "Talent telah menerima arahan perbaikan." });
      router.refresh();
    });
  }

  function submitReview(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await createProjectReviewAction(formData);
      if (!result.success) {
        setError(result.error || "Ulasan gagal disimpan.");
        return;
      }
      await Swal.fire({ icon: "success", title: "Ulasan tersimpan" });
      router.refresh();
    });
  }

  async function approveResult() {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: "Setujui hasil proyek?",
      text: "Dana akan langsung masuk ke saldo talent setelah hasil disetujui.",
      showCancelButton: true,
      confirmButtonText: "Setujui & Lepas Saldo",
      cancelButtonText: "Batal",
      confirmButtonColor: "#FF6B35",
      focusCancel: true,
      reverseButtons: true,
    });
    if (!confirmation.isConfirmed) return;
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
          <h4 className="font-display text-sm font-black text-ink">{project.submission?.revisionCount ? `Kirim hasil revisi ${project.submission.revisionCount}/2` : "Kirim hasil pekerjaan"}</h4>
          {project.submission?.latestRevisionReason && <p className="rounded-lg bg-warning/10 p-3 text-sm text-ink"><strong>Arahan revisi:</strong> {project.submission.latestRevisionReason}</p>}
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
            <div className="mt-4 space-y-3">
              <button type="button" disabled={isPending} onClick={() => void approveResult()} className="rounded-full bg-success px-5 py-2.5 text-xs font-display font-bold uppercase text-white disabled:opacity-60">{isPending ? "Memproses..." : "Setujui & Lepas Saldo"}</button>
              {project.submission.revisionCount < 2 && <form action={requestRevision} className="space-y-2 rounded-lg border border-hairline bg-card p-3">
                <input type="hidden" name="projectId" value={project.id} />
                <textarea name="reason" required minLength={20} maxLength={2000} rows={3} placeholder={`Arahan revisi ${project.submission.revisionCount + 1}/2`} className="w-full resize-y rounded-lg border border-hairline bg-canvas px-3 py-2 text-sm outline-none focus:border-brand" />
                <button type="submit" disabled={isPending} className="rounded-full border border-brand px-4 py-2 text-xs font-bold uppercase text-brand disabled:opacity-60">Minta Revisi</button>
              </form>}
            </div>
          )}
        </div>
      )}
      {project.workflowAction === "LEAVE_REVIEW" && (
        <form action={submitReview} className="space-y-3 rounded-xl bg-canvas p-4">
          <input type="hidden" name="projectId" value={project.id} />
          <h4 className="font-display text-sm font-black text-ink">Nilai kolaborasi talent</h4>
          <select name="rating" required defaultValue="5" className="w-full rounded-lg border border-hairline bg-card px-4 py-3 text-sm"><option value="5">5 - Sangat baik</option><option value="4">4 - Baik</option><option value="3">3 - Cukup</option><option value="2">2 - Kurang</option><option value="1">1 - Sangat kurang</option></select>
          <textarea name="comment" maxLength={2000} rows={3} placeholder="Ceritakan pengalaman bekerja sama (opsional)." className="w-full resize-y rounded-lg border border-hairline bg-card px-4 py-3 text-sm outline-none focus:border-brand" />
          <button type="submit" disabled={isPending} className="rounded-full bg-brand px-5 py-2.5 text-xs font-bold uppercase text-white disabled:opacity-60">Simpan Ulasan</button>
        </form>
      )}
      {error && <p role="alert" className="mt-3 rounded-lg bg-danger-soft p-3 text-sm font-semibold text-danger">{error}</p>}
    </div>
  );
}
