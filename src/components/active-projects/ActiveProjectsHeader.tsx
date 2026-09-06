"use client";

import PageHeader from "@/components/layout/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { ActiveProjectsViewerRole } from "@/types/active-project";

export default function ActiveProjectsHeader({ role }: { role: ActiveProjectsViewerRole }) {
  const { dict: t } = usePreferences();

  const title =
    role === "STUDENT"
      ? t.activeProjects.titleStudent
      : role === "UMKM"
        ? t.activeProjects.titleUmkm
        : t.activeProjects.titleAdmin;

  const subtitle =
    role === "STUDENT"
      ? t.activeProjects.subtitleStudent
      : role === "UMKM"
        ? t.activeProjects.subtitleUmkm
        : t.activeProjects.subtitleAdmin;

  return <PageHeader title={title} subtitle={subtitle} />;
}
