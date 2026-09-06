"use client";

import { usePreferences } from "@/contexts/PreferencesContext";
import type { ActiveProjectsViewerRole } from "@/types/active-project";

interface CollaborationTipsCardProps {
  tip?: string;
  viewerRole?: ActiveProjectsViewerRole;
}

export default function CollaborationTipsCard({ tip, viewerRole = "STUDENT" }: CollaborationTipsCardProps) {
  const { dict: t } = usePreferences();

  const defaultTip =
    viewerRole === "UMKM"
      ? t.activeProjects.collaborationTipUmkm
      : viewerRole === "ADMIN"
        ? t.activeProjects.collaborationTipAdmin
        : t.activeProjects.collaborationTipStudent;

  return (
    <div className="rounded-xl bg-gray p-5">
      <h3 className="font-display text-sm font-black text-white">
        {t.activeProjects.collaborationTipTitle}
      </h3>
      <p className="mt-3 font-body text-sm leading-relaxed text-white">
        {defaultTip || tip}
      </p>
    </div>
  );
}