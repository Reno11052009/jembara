"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { beginTwoFactorSetupAction, confirmTwoFactorSetupAction, disableTwoFactorAction } from "@/app/actions/security";

export default function TwoFactorAuthCard({ enabled }: { enabled: boolean }) {
  const router = useRouter(); const [pending, startTransition] = useTransition();
  const [setup, setSetup] = useState<{ secret: string; otpAuthUri: string } | null>(null);
  const [code, setCode] = useState(""); const [password, setPassword] = useState("");
  function begin() { startTransition(async () => { const result = await beginTwoFactorSetupAction(password); if (!result.success) await Swal.fire({ icon: "error", title: "Setup gagal", text: result.error }); else setSetup({ secret: result.secret, otpAuthUri: result.otpAuthUri }); }); }
  function confirm() { startTransition(async () => { const result = await confirmTwoFactorSetupAction(code); if (!result.success) await Swal.fire({ icon: "error", title: "Kode tidak valid", text: result.error }); else { await Swal.fire({ icon: "success", title: "2FA aktif", html: `<p>Simpan kode pemulihan ini di tempat aman:</p><pre style="white-space:pre-wrap;margin-top:12px">${result.recoveryCodes.join("\n")}</pre>`, confirmButtonText: "Saya sudah menyimpan" }); setSetup(null); router.refresh(); } }); }
  function disable() { startTransition(async () => { const result = await disableTwoFactorAction(password); if (!result.success) await Swal.fire({ icon: "error", title: "Gagal menonaktifkan", text: result.error }); else { await Swal.fire({ icon: "success", title: "2FA dinonaktifkan" }); router.refresh(); } }); }
  return <section className="rounded-xl border border-[#ECECEC] bg-white p-6 dark:bg-card">
    <div className="flex flex-wrap items-start justify-between gap-6"><div><h2 className="mb-2 font-display text-lg font-bold text-neutral-900 dark:text-ink">Autentikasi Dua Faktor (2FA)</h2><p className="max-w-xl text-sm text-neutral-500 dark:text-ink-muted">Gunakan aplikasi autentikator berbasis TOTP. Delapan kode pemulihan hanya ditampilkan sekali saat aktivasi.</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${enabled ? "bg-success/10 text-success" : "bg-neutral-100 text-neutral-600 dark:bg-surface dark:text-ink-muted"}`}>{enabled ? "Aktif" : "Tidak aktif"}</span></div>
    <div className="mt-5 max-w-xl space-y-3">
      <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Konfirmasi password saat ini" className="w-full rounded-lg border border-hairline bg-card px-4 py-3 text-sm" />
      {!enabled && !setup && <button type="button" disabled={pending || !password} onClick={begin} className="rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">Mulai Setup 2FA</button>}
      {setup && <div className="space-y-3 rounded-xl bg-canvas p-4"><p className="text-sm font-semibold">Masukkan secret berikut ke aplikasi autentikator:</p><code className="block break-all rounded-lg bg-card p-3 text-sm">{setup.secret}</code><a href={setup.otpAuthUri} className="inline-flex text-sm font-bold text-brand">Buka di aplikasi autentikator</a><input value={code} onChange={(event) => setCode(event.target.value.replace(/\s/g, ""))} inputMode="numeric" autoComplete="one-time-code" placeholder="Kode 6 digit" maxLength={6} className="w-full rounded-lg border border-hairline bg-card px-4 py-3 text-sm" /><button type="button" disabled={pending || code.length !== 6} onClick={confirm} className="rounded-full bg-success px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">Verifikasi & Aktifkan</button></div>}
      {enabled && <button type="button" disabled={pending || !password} onClick={disable} className="rounded-full border border-danger px-5 py-2.5 text-sm font-bold text-danger disabled:opacity-50">Nonaktifkan 2FA</button>}
    </div>
  </section>;
}
