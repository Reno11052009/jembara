"use client";

import Swal from "sweetalert2";
import { createProjectReportAction } from "@/app/actions/reports";

export default function ReportProjectButton({ projectId }: { projectId: string }) {
  async function report() {
    const result = await Swal.fire({ title: "Laporkan project", input: "textarea", inputLabel: "Jelaskan masalah", inputPlaceholder: "Minimal 20 karakter", inputAttributes: { maxlength: "2000" }, showCancelButton: true, confirmButtonText: "Kirim Laporan", cancelButtonText: "Batal", confirmButtonColor: "#dc2626", inputValidator: (value) => value.trim().length >= 20 ? undefined : "Minimal 20 karakter." });
    if (!result.isConfirmed) return;
    const formData = new FormData(); formData.set("projectId", projectId); formData.set("category", "INAPPROPRIATE"); formData.set("description", result.value);
    const response = await createProjectReportAction(formData);
    await Swal.fire(response.success ? { icon: "success", title: "Laporan dikirim", text: "Admin akan meninjau laporan Anda." } : { icon: "error", title: "Laporan gagal", text: response.error });
  }
  return <button type="button" onClick={() => void report()} className="rounded-full border border-danger px-3 py-2 text-sm font-semibold text-danger">Laporkan</button>;
}
