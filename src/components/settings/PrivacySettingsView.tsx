import ProfileVisibilityCard from "@/components/settings/ProfileVisibilityCard";
import PrivacyPreferencesCard from "@/components/settings/PrivacyPreferencesCard";
import DataAccountCard from "@/components/settings/DataAccountCard";

export default function PrivacySettingsView() {
  return (
    <div className="flex flex-col gap-6">
      <ProfileVisibilityCard />
      <PrivacyPreferencesCard />
      <DataAccountCard />
    </div>
  );
}
