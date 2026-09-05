import ProfileVisibilityCard from "@/components/settings/ProfileVisibilityCard";
import DataAccountCard from "@/components/settings/DataAccountCard";
import type { PrivacySettingsData } from "@/lib/privacy";

export default function PrivacySettingsView({
  initialData,
}: {
  initialData: PrivacySettingsData;
}) {
  return (
    <div className="flex flex-col gap-6">
      <ProfileVisibilityCard initialData={initialData} />
      <DataAccountCard />
    </div>
  );
}
