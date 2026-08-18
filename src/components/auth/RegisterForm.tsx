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
import { registerAction } from "@/app/actions/auth";

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
  const [status, setStatus] = useState<FormStatus>("idle");

  function handleChange(field: keyof RegisterFormData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
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

    const result = await registerAction(formData);

    if (result?.error) {
      setServerError(result.error);
      setStatus("error");
    } else {
      setStatus("success");
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

      <Button type="submit" isLoading={status === "submitting"} fullWidth>
        Gabung Matchmaking
      </Button>
    </form>
  );
}