import PageHeader, { type PageHeaderProps } from "@/components/layout/PageHeader";
import { getCachedProfileData } from "@/lib/profile";

type DashboardPageHeaderProps = Omit<PageHeaderProps, "avatarUrl">;

export default async function DashboardPageHeader(props: DashboardPageHeaderProps) {
  const profileData = await getCachedProfileData();

  return <PageHeader {...props} avatarUrl={profileData.avatarUrl} />;
}
