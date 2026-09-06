"use client";

import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function LoginView() {
  const { dict: t } = usePreferences();

  return (
    <AuthShell
      eyebrow={t.auth.eyebrowLogin}
      title={t.auth.loginHeadline}
      subtitle={t.auth.loginSubtitleText}
      footer={
        <>
          {t.auth.noAccountText}{" "}
          <Link href="/register" className="font-medium text-queue-soft hover:text-queue">
            {t.auth.registerText}
          </Link>
        </>
      }
    >
      <LoginForm />
    </AuthShell>
  );
}
