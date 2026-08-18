"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import InputField from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { RegisterFormData, RegisterFormErrors, FormStatus } from "@/types/auth";
import {
  validateFullName,
  validatePassword,
  validateConfirmPassword,
  validateAddress,
} from "@/lib/validation";
import { createClient } from "@/lib/client";

const initialData: RegisterFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
};

export default function RegisterForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>(initialData);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(field: keyof RegisterFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    if (serverError) setServerError(null);
  }

  function validate(): RegisterFormErrors {
    return {
      fullName: validateFullName(formData.fullName),
      password: validatePassword(formData.password),
      confirmPassword: validateConfirmPassword(
        formData.password,
        formData.confirmPassword
      ),
      address: validateAddress(formData.address),
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
    const { error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.fullName,
          address: formData.address,
        },
      },
    });

    if (error) {
      setServerError(error.message);
      setStatus("error");
    } else {
      setStatus("success");
      router.push("/pilih-role");
      router.refresh();
    }
  }

  const completion = useMemo(() => {
    const fields = Object.values(formData);
    const filled = fields.filter((v) => v.trim().length > 0).length;
    return Math.round((filled / fields.length) * 100);
  }, [formData]);

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div>
        <div className="mb-1.5 flex justify-between text-xs text-ink-muted">
          <span>Profile Progress</span>
          <span className="font-medium text-brand">{completion}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-hairline">
          <div
            className="h-full rounded-full bg-brand transition-all duration-300"
            style={{ width: `${completion}%` }}
          />
        </div>
      </div>

      <InputField
        label="Nama Lengkap"
        autoComplete="name"
        placeholder="Nama kamu"
        value={formData.fullName}
        error={errors.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
      />
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
        label="Alamat"
        type="text"
        autoComplete="street-address"
        placeholder="Alamat lengkap (min. 5 karakter)"
        value={formData.address}
        error={errors.address}
        onChange={(e) => handleChange("address", e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        autoComplete="new-password"
        placeholder="Minimal 8 karakter"
        value={formData.password}
        error={errors.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
      <InputField
        label="Konfirmasi Password"
        type="password"
        autoComplete="new-password"
        placeholder="Ulangi password"
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
      />

      {status === "success" && (
        <p className="text-xs text-success">
          Akun dibuat. Menyiapkan profil kamu...
        </p>
      )}

      {serverError && (
        <p className="text-xs text-danger">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={status === "submitting"}>
        Gabung Matchmaking
      </Button>
    </form>
  );
}