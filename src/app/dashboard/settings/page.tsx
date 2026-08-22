import { getCachedProfileData } from "@/lib/profile";
import { getCurrentNotificationPreferences } from "@/lib/notification-preferences";
import SettingsView from "@/components/settings/SettingsView";

export const metadata = {
  title: "Settings | JemBara",
  description: "Kelola akun dan preferensi kamu di JemBara.",
};

export default async function SettingsPage() {
  const [profileData, notificationPreferences] = await Promise.all([
    getCachedProfileData(),
    getCurrentNotificationPreferences(),
  ]);

  return (
    <SettingsView
      initialData={profileData}
      initialNotificationPreferences={notificationPreferences}
    />
  );
}
