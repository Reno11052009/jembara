import { Suspense } from "react";
import PageHeader, { type PageHeaderProps } from "@/components/layout/PageHeader";
import { getCachedHeaderProfileData } from "@/lib/profile";

type DashboardPageHeaderProps = Omit<PageHeaderProps, "avatarUrl">;

async function ProfileAwarePageHeader(props: DashboardPageHeaderProps) {
  const profileData = await getCachedHeaderProfileData();

  return (
    <PageHeader
      {...props}
      userName={props.userName ?? profileData.userName}
      avatarUrl={profileData.avatarUrl}
    />
  );
}

function HeaderSkeleton({ title, subtitle }: DashboardPageHeaderProps) {
  return (
    <div className="mb-6 flex items-start justify-between" role="status">
      <div>
        <h1 className="font-display text-2xl font-black text-ink">{title}</h1>
        <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
      </div>
      <div className="h-9 w-9 animate-pulse rounded-full bg-slate-200 dark:bg-line" aria-hidden="true" />
      <span className="sr-only">Memuat profil…</span>
    </div>
  );
}

export default function DashboardPageHeader(props: DashboardPageHeaderProps) {
  return (
    <Suspense fallback={<HeaderSkeleton {...props} />}>
      <ProfileAwarePageHeader {...props} />
    </Suspense>
  );
}
