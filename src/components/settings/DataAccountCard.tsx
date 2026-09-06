"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { deleteAccountAction } from "@/app/actions/account";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function DataAccountCard() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { dict } = usePreferences();

  async function confirmDeletion() {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: dict.settingsCards?.privacy?.confirmDeleteTitle || "Hapus akun permanen?",
      text: dict.settingsCards?.privacy?.confirmDeleteText || "Masukkan password untuk mengonfirmasi. Akun dengan transaksi atau proyek tidak dapat dihapus otomatis.",
      input: "password",
      inputLabel: dict.auth?.passwordLabel || "Password",
      inputAttributes: { autocomplete: "current-password", maxlength: "128" },
      showCancelButton: true,
      confirmButtonText: dict.settingsCards?.privacy?.deleteAccountButton || "Hapus akun",
      cancelButtonText: dict.common?.cancel || "Batal",
      confirmButtonColor: "#dc2626",
      preConfirm: (password) => {
        if (!password) {
          Swal.showValidationMessage(dict.settingsCards?.privacy?.passwordRequired || "Password wajib diisi.");
          return false;
        }
        return password;
      },
    });
    if (!confirmation.isConfirmed || typeof confirmation.value !== "string") return;

    startTransition(async () => {
      const result = await deleteAccountAction({ password: confirmation.value });
      if (!result.success) {
        await Swal.fire({ icon: "error", title: dict.common?.cancel || "Gagal", text: result.error });
        return;
      }
      await Swal.fire({ icon: "success", title: dict.settingsCards?.privacy?.saveSuccess || "Akun telah dihapus", confirmButtonText: dict.common?.back || "Kembali" });
      router.replace("/");
      router.refresh();
    });
  }
  return (
    <section className="rounded-xl border border-[#ECECEC] dark:border-hairline bg-white dark:bg-card p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 dark:text-ink mb-5">
        {dict.settingsCards?.privacy?.dataAccountTitle || "Data & Akun"}
      </h2>

      <div className="flex items-start justify-between gap-6 pb-5 border-b border-[#ECECEC] dark:border-hairline">
        <div>
          <p className="font-body text-sm font-semibold text-neutral-900 dark:text-ink mb-1">
            {dict.settingsCards?.privacy?.downloadDataTitle || "Unduh Informasi Data Pribadi"}
          </p>
          <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
            {dict.settingsCards?.privacy?.downloadDataDesc || "Ekspor seluruh salinan data aktivitas kamu, proyek, dan riwayat proposal dalam format file .JSON."}
          </p>
        </div>

        <a
          href="/api/account/export"
          className="font-body text-sm font-semibold text-neutral-900 dark:text-ink border border-neutral-300 rounded-full px-5 py-2.5 hover:bg-neutral-50 dark:hover:bg-void transition-colors shrink-0"
        >
          {dict.settingsCards?.privacy?.downloadDataButton || "Unduh Data"}
        </a>
      </div>

      <div className="flex items-start justify-between gap-6 pt-5">
        <div>
          <p className="font-body text-sm font-semibold text-red-500 dark:text-red-400 mb-1">
            {dict.settingsCards?.privacy?.deleteAccountTitle || "Hapus Akun Permanen"}
          </p>
          <p className="font-body text-sm text-neutral-500 dark:text-ink-muted max-w-xl">
            {dict.settingsCards?.privacy?.deleteAccountDesc || "Aksi ini akan menghapus akun, portfolio, proposal aktif, dan seluruh data kamu selamanya. Aksi tidak dapat dibatalkan."}
          </p>
        </div>

        <button
          type="button"
          disabled={isPending}
          onClick={confirmDeletion}
          className="font-body text-sm font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors rounded-full px-5 py-2.5 shrink-0"
        >
          {isPending ? (dict.settingsCards?.privacy?.deleting || "Menghapus...") : (dict.settingsCards?.privacy?.deleteAccountButton || "Hapus Akun")}
        </button>
      </div>
    </section>
  );
}