import { getCachedProfileData } from "@/lib/profile";
import { getCurrentNotificationPreferences } from "@/lib/notification-preferences";
import SettingsView from "@/components/settings/SettingsView";
import { getActiveSessionsData } from "@/lib/account-security";
import { getBusinessCategoryOptions } from "@/lib/business-categories";
import { getPaymentSettingsData } from "@/lib/payment-settings";
import { getTwoFactorStatus } from "@/lib/two-factor";

export const metadata = {
  title: "Settings | JemBara",
  description: "Kelola akun dan preferensi kamu di JemBara.",
};

export const instant = false;

export default async function SettingsPage() {
  const [profileData, notificationPreferences, sessions, businessCategoryOptions, paymentSettings, twoFactorStatus] =
    await Promise.all([
      getCachedProfileData(),
      getCurrentNotificationPreferences(),
      getActiveSessionsData(),
      getBusinessCategoryOptions(),
      getPaymentSettingsData(),
      getTwoFactorStatus(),
    ]);

  return (
    <SettingsView
      initialData={profileData}
      initialNotificationPreferences={notificationPreferences}
      initialSessions={sessions}
      businessCategoryOptions={businessCategoryOptions}
      initialPaymentSettings={paymentSettings}
      initialTwoFactorEnabled={twoFactorStatus.enabled}
    />
  );
}
