"use client";

import { FormEvent, useMemo, useState } from "react";
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
import { usePreferences } from "@/contexts/PreferencesContext";

const initialData: RegisterFormData = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
  address: "",
};

export default function RegisterForm() {
  const { dict } = usePreferences();
  const [formData, setFormData] = useState<RegisterFormData>(initialData);
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [serverError, setServerError] = useState<string | null>(null);
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

  const progress = useMemo(() => {
    const fields = Object.values(formData);
    const filled = fields.filter((v) => v.trim().length > 0).length;
    return { filled, total: fields.length };
  }, [formData]);

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-5 rounded-xl border border-gray-200 p-6 dark:border-gray-700"
    >
      <div>
        <div className="mb-1.5 flex justify-between text-xs text-ink-muted">
          <span>{dict.auth.profileProgress}</span>
          <span className="font-medium text-brand">
            {progress.filled}/{progress.total}
          </span>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: progress.total }).map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                i < progress.filled ? "bg-brand" : "bg-hairline"
              }`}
            />
          ))}
        </div>
      </div>

      <InputField
        label={dict.auth.nameLabel}
        required
        autoComplete="name"
        placeholder={dict.auth.fullNamePlaceholder}
        value={formData.fullName}
        error={errors.fullName}
        onChange={(e) => handleChange("fullName", e.target.value)}
      />
      <InputField
        label={dict.auth.emailLabel}
        required
        type="email"
        autoComplete="email"
        placeholder="kamu@email.com"
        value={formData.email}
        error={errors.email}
        onChange={(e) => handleChange("email", e.target.value)}
      />
      <InputField
        label={dict.auth.addressLabel}
        required
        type="text"
        autoComplete="street-address"
        placeholder={dict.auth.addressPlaceholder}
        value={formData.address}
        error={errors.address}
        onChange={(e) => handleChange("address", e.target.value)}
      />
      <InputField
        label={dict.auth.passwordLabel}
        required
        type="password"
        autoComplete="new-password"
        placeholder={dict.auth.passwordMinPlaceholder}
        value={formData.password}
        error={errors.password}
        onChange={(e) => handleChange("password", e.target.value)}
      />
      <InputField
        label={dict.auth.confirmPasswordLabel}
        required
        type="password"
        autoComplete="new-password"
        placeholder={dict.auth.repeatPasswordPlaceholder}
        value={formData.confirmPassword}
        error={errors.confirmPassword}
        onChange={(e) => handleChange("confirmPassword", e.target.value)}
      />

      {status === "success" && (
        <p className="text-xs text-success">
          {dict.auth.registerSuccessMsg}
        </p>
      )}

      {serverError && (
        <p className="text-xs text-danger">
          {serverError}
        </p>
      )}

      <Button type="submit" isLoading={status === "submitting"} fullWidth>
        {dict.auth.registerButton}
      </Button>
    </form>
  );
}