"use client";

import { FormEvent, useState } from "react";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { LoginFormData, LoginFormErrors, FormStatus } from "@/types/auth";
import { validateEmail, validatePassword } from "@/lib/validation";
import Modal from "@/components/ui/Modal";

export default function LoginForm() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [status, setStatus] = useState<FormStatus>("idle");
  const [modalOpen, setModalOpen] = useState(false);

  function handleChange(field: keyof LoginFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function validate(): LoginFormErrors {
    return {
      email: validateEmail(formData.email),
      password: validatePassword(formData.password),
    };
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const nextErrors = validate();
    const hasError = Object.values(nextErrors).some(Boolean);
    setErrors(nextErrors);

    if (hasError) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      // TODO: ganti dengan pemanggilan API auth yang sebenarnya
      await new Promise((resolve) => setTimeout(resolve, 900));
      setStatus("success");
    } catch {
        setStatus("error");
        setModalOpen(true);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <InputField
        label="Email"
        type="email"
        autoComplete="email"
        placeholder="kamu@email.com"
        value={formData.email}
        error={errors.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        value={formData.password}
        error={errors.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />

      {status === "success" && (
        <p className="font-mono text-xs text-xp">
          Masuk berhasil. Mengarahkan ke dashboard...
        </p>
      )}

      <Button type="submit" isLoading={status === "submitting"}>
        Masuk Antrean
      </Button>

      <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          icon="error"
          title="Koneksi ke server gagal"
          description="Sepertinya ada gangguan saat proses matchmaking. Coba lagi dalam beberapa saat."
          footer={
            <a href="/help" className="text-queue-soft hover:text-queue">
              Kenapa ini terjadi?
            </a>
          }
        />
    </form>
  );
}