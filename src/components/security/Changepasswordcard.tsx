"use client";

import { useState } from "react";
import Input from "@/components/ui/Input";

export default function ChangePasswordCard() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Ubah Password
      </h2>

      <div className="mb-4">
        <Input
          type="password"
          label="PASSWORD SAAT INI"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          type="password"
          label="PASSWORD BARU"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="••••••••"
        />
        <Input
          type="password"
          label="KONFIRMASI PASSWORD BARU"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
        />
      </div>
    </section>
  );
}