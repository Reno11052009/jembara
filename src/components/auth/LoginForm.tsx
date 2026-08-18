"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import { LoginFormData, LoginFormErrors, FormStatus } from "@/types/auth";
import { validatePassword } from "@/lib/validation";
import { createClient } from "@/lib/client";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");
  const [modalOpen, setModalOpen] = useState(false);

  function handleChange(field: keyof LoginFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError(null);
  }

  function validate(): LoginFormErrors {
    return {
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
    setServerError(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    });

    if (error) {
      setServerError(error.message);
      setStatus("error");
    } else {
      setStatus("success");
      router.push("/dashboard");
      router.refresh();
    }
  }

  return (
    <>
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
          <p className="text-xs text-success">
            Masuk berhasil. Mengarahkan ke dashboard...
          </p>
        )}

        {serverError && (
          <p className="text-xs text-danger">
            {serverError}
          </p>
        )}

        <Button type="submit" isLoading={status === "submitting"}>
          Masuk Antrean
        </Button>
      </form>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        icon="error"
        title="Koneksi ke server gagal"
        description="Sepertinya ada gangguan saat proses matchmaking. Coba lagi dalam beberapa saat."
        footer={
          <a href="/help" className="text-brand hover:opacity-80">
            Kenapa ini terjadi?
          </a>
        }
      />
    </>
  );
}