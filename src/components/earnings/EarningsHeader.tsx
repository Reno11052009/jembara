"use client";

import PageHeader from "@/components/layout/PageHeader";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function EarningsHeader() {
  const { dict: t } = usePreferences();
  return (
    <PageHeader
      title={t.earningsCards.pageTitle}
      subtitle={t.earningsCards.pageSubtitle}
    />
  );
}
