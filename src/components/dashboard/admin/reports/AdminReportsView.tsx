"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { updateReportStatusAction } from "@/app/actions/reports";

type Report = Awaited<ReturnType<typeof import("@/lib/admin-reports").getAdminReportsData>>["reports"][number];
export default function AdminReportsView({ reports }: { reports: Report[] }) {
  const router = useRouter(); const [pending, startTransition] = useTransition();
  function decide(id: string, status: "REVIEWING" | "RESOLVED" | "REJECTED") { startTransition(async () => { const note = status === "REVIEWING" ? "Sedang ditinjau admin" : (await Swal.fire({ title: status === "RESOLVED" ? "Selesaikan laporan" : "Tolak laporan", input: "textarea", inputLabel: "Catatan keputusan", showCancelButton: true })).value; if (status !== "REVIEWING" && note === undefined) return; const result = await updateReportStatusAction(id, status, note || ""); if (!result.success) await Swal.fire({ icon: "error", title: "Gagal", text: result.error }); else router.refresh(); }); }
  return <div className="space-y-4">{reports.length ? reports.map((report) => <article key={report.id} className="rounded-xl border border-hairline bg-card p-5"><div className="flex flex-wrap justify-between gap-3"><div><h2 className="font-display font-black">{report.project?.title || "Konten Jembara"}</h2><p className="text-xs text-ink-muted">Pelapor: {report.reporter.name || report.reporter.email} · {report.category}</p></div><span className="rounded-full bg-canvas px-3 py-1 text-xs font-bold">{report.status}</span></div><p className="mt-3 whitespace-pre-line text-sm text-ink-muted">{report.description}</p>{report.resolutionNote && <p className="mt-2 text-xs">Catatan: {report.resolutionNote}</p>}<div className="mt-4 flex flex-wrap gap-2"><button disabled={pending} onClick={() => decide(report.id, "REVIEWING")} className="rounded-full border border-ink px-3 py-1.5 text-xs font-bold">Tinjau</button><button disabled={pending} onClick={() => decide(report.id, "RESOLVED")} className="rounded-full bg-success px-3 py-1.5 text-xs font-bold text-white">Selesaikan</button><button disabled={pending} onClick={() => decide(report.id, "REJECTED")} className="rounded-full border border-danger px-3 py-1.5 text-xs font-bold text-danger">Tolak</button></div></article>) : <p className="rounded-xl border border-dashed border-hairline bg-card p-8 text-center text-ink-muted">Belum ada laporan.</p>}</div>;
}
