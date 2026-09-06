"use client";

import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function RegisterView() {
  const { dict: t } = usePreferences();

  return (
    <AuthShell
      eyebrow={t.auth.eyebrowRegister}
      title={t.auth.registerHeadline}
      subtitle={t.auth.registerSubtitleText}
      footer={
        <>
          {t.auth.hasAccountText}{" "}
          <Link href="/login" className="font-medium text-queue-soft hover:text-queue">
            {t.auth.loginText}
          </Link>
        </>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
