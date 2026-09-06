"use client";

import PageHeader from "@/components/layout/PageHeader";
import RelationsFilterTabs from "@/components/dashboard/admin/relations/RelationsFilterTabs";
import RelationsTableCard from "@/components/dashboard/admin/relations/RelationsTableCard";
import type { AdminRelationsData } from "@/types/admin-relations";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function AdminRelationsView({ data }: { data: AdminRelationsData }) {
  const { dict } = usePreferences();
  return (
    <>
      <PageHeader title={dict.admin.relationsTitle} subtitle={dict.admin.relationsSubtitle} userName={data.adminName} avatarUrl={data.adminAvatarUrl} />
      <div className="flex flex-col gap-6"><RelationsFilterTabs active={data.activeFilter} /><RelationsTableCard rows={data.rows} /></div>
    </>
  );
}
