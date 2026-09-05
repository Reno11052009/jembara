"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { verifyStudentSkillAction } from "@/app/actions/skills";

type Item = Awaited<ReturnType<typeof import("@/lib/admin-skills").getSkillVerificationData>>["skills"][number];

export default function SkillVerificationView({ items }: { items: Item[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  function decide(id: string, verified: boolean) {
    startTransition(async () => {
      const result = await verifyStudentSkillAction(id, verified);
      if (!result.success) await Swal.fire({ icon: "error", title: "Gagal", text: result.error });
      else { await Swal.fire({ icon: "success", title: verified ? "Skill terverifikasi" : "Verifikasi dicabut" }); router.refresh(); }
    });
  }
  return <div className="space-y-4">
    {items.length ? items.map((item) => <article key={item.id} className="rounded-xl border border-hairline bg-card p-5">
      <div className="flex flex-wrap items-start justify-between gap-4"><div><h2 className="font-display font-black">{item.skill.name}</h2><p className="text-sm text-ink-muted">{item.student.user.name || "Pelajar Jembara"} · {item.level.toLocaleLowerCase("id-ID")}</p><p className="mt-2 text-xs text-ink-muted">{item.evidencePortfolio ? `Bukti: ${item.evidencePortfolio.title}` : `${item.student.projects.length} project selesai`}</p>{item.evidencePortfolio?.link && <a href={item.evidencePortfolio.link} target="_blank" rel="noreferrer" className="mt-2 inline-flex text-sm font-bold text-brand">Buka bukti</a>}</div><span className={`rounded-full px-3 py-1 text-xs font-bold ${item.isVerified ? "bg-success/10 text-success" : "bg-warning/10 text-warning"}`}>{item.isVerified ? "Terverifikasi" : "Menunggu"}</span></div>
      <div className="mt-4 flex gap-2"><button disabled={pending || item.isVerified} onClick={() => decide(item.id, true)} className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white disabled:opacity-40">Verifikasi</button><button disabled={pending || !item.isVerified} onClick={() => decide(item.id, false)} className="rounded-full border border-danger px-4 py-2 text-xs font-bold text-danger disabled:opacity-40">Cabut</button></div>
    </article>) : <p className="rounded-xl border border-dashed border-hairline bg-card p-8 text-center text-ink-muted">Belum ada bukti skill untuk ditinjau.</p>}
  </div>;
}
