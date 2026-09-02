"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Input from "@/components/ui/Input";
import { changePasswordAction } from "@/app/actions/security";

export default function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const result = await changePasswordAction({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      if (!result.success) throw new Error(result.error);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      router.refresh();
      await Swal.fire({
        icon: "success",
        title: "Password diperbarui",
        text: "Semua sesi lama telah dicabut. Sesi perangkat ini sudah diperbarui.",
        confirmButtonColor: "#f97316",
      });
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Gagal mengubah password",
        text: error instanceof Error ? error.message : "Silakan coba lagi.",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-xl border border-[#ECECEC] bg-white dark:bg-card p-6">
      <h2 className="mb-5 font-display text-lg font-bold text-neutral-900 dark:text-ink">
        Ubah Password
      </h2>

      <div className="mb-4">
        <Input
          type="password"
          label="PASSWORD SAAT INI"
          value={currentPassword}
          onChange={(event) => setCurrentPassword(event.target.value)}
          autoComplete="current-password"
          required
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input
          type="password"
          label="PASSWORD BARU"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
        <Input
          type="password"
          label="KONFIRMASI PASSWORD BARU"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <div className="mt-5 flex justify-end">
        <button
          type="submit"
          disabled={isSaving}
          className="rounded-full bg-brand px-6 py-2.5 font-body text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Menyimpan..." : "Ubah Password"}
        </button>
      </div>
    </form>
  );
}
