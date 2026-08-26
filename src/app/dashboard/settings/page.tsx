import { getCachedProfileData } from "@/lib/profile";
import { getCurrentNotificationPreferences } from "@/lib/notification-preferences";
import SettingsView from "@/components/settings/SettingsView";
import { getActiveSessionsData } from "@/lib/account-security";

export const metadata = {
  title: "Settings | JemBara",
  description: "Kelola akun dan preferensi kamu di JemBara.",
};

export default async function SettingsPage() {
  const [profileData, notificationPreferences, sessions] = await Promise.all([
    getCachedProfileData(),
    getCurrentNotificationPreferences(),
    getActiveSessionsData(),
  ]);

  return (
    <SettingsView
      initialData={profileData}
      initialNotificationPreferences={notificationPreferences}
      initialSessions={sessions}
    />
  );
}
