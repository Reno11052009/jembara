"use client";

import RoleSelectionCards from "@/components/auth/RoleSelectionCards";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function PilihRoleView() {
  const { dict: t } = usePreferences();

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 via-white to-zinc-100 p-4 font-sans text-zinc-900 overflow-hidden dark:bg-canvas dark:from-canvas dark:via-card dark:to-canvas dark:text-ink">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand/5 blur-3xl dark:bg-brand/20" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand/5 blur-3xl dark:bg-brand/20" />
      </div>

      <div className="relative w-full max-w-4xl text-center">
        {/* Header with badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand dark:bg-brand-soft">
          <span>{t.auth.selectRoleBadge}</span>
        </div>

        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl dark:text-brand">
          {t.auth.joinAsTitle}
        </h1>
        <p className="mx-auto mb-10 max-w-md text-base text-zinc-500 dark:text-ink-muted">
          {t.auth.joinAsDesc}
        </p>

        <RoleSelectionCards />

        {/* Footer note */}
        <p className="mt-8 text-xs text-zinc-400 dark:text-ink-muted">
          {t.auth.joinFreeNote}
        </p>
      </div>
    </div>
  );
}