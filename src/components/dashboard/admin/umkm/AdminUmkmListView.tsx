"use client";

import PageHeader from "@/components/layout/PageHeader";
import UmkmListToolbar from "@/components/dashboard/admin/umkm/UmkmListToolbar";
import UmkmListTable from "@/components/dashboard/admin/umkm/UmkmListTable";
import AdminPagination from "@/components/dashboard/admin/AdminPagination";
import type { AdminUmkmData } from "@/types/admin-umkm";
import { usePreferences } from "@/contexts/PreferencesContext";

export default function AdminUmkmListView({ data }: { data: AdminUmkmData }) {
  const { dict } = usePreferences();

  return (
    <>
      <PageHeader
        title={dict.admin.umkmListTitle}
        subtitle={dict.admin.umkmListSubtitle}
        userName={data.adminName}
        avatarUrl={data.adminAvatarUrl}
      />

      <div className="flex flex-col gap-6">
        <UmkmListToolbar
          filters={data.filters}
          statusOptions={data.statusOptions}
        />
        <UmkmListTable rows={data.rows} />
        <AdminPagination
          basePath="/dashboard/daftar-umkm"
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          summary={data.summary}
          preservedParams={{
            q: data.filters.query,
            profileStatus: data.filters.profileStatus,
          }}
        />
      </div>
    </>
  );
}
