import SecuritySettingsView from "@/components/security/Securitysettingsview";
import { getActiveSessionsData } from "@/lib/account-security";
import { getTwoFactorStatus } from "@/lib/two-factor";

export const metadata = {
  title: "Keamanan | JemBara",
  description: "Kelola keamanan akun dan verifikasi autentikasi.",
};

export const instant = false;

export default async function KeamananSettingsPage() {
  const [sessions, twoFactor] = await Promise.all([getActiveSessionsData(), getTwoFactorStatus()]);
  return <SecuritySettingsView sessions={sessions} twoFactorEnabled={twoFactor.enabled} />;
}
