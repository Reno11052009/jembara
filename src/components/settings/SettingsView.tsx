"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProfileSettings from "./ProfileSettings";
import SecuritySettingsView from "@/components/security/Securitysettingsview";
import NotificationSettingsCard from "./NotificationSettingsCard";
import PaymentSettingsView from "./PaymentSettingsView";
import PrivacySettingsView from "./PrivacySettingsView";
import LanguageAppearanceSettings from "./LanguageAppearanceSettings";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { ProfileData } from "@/lib/profile";
import type { NotificationPreferences } from "@/types/notification";
import type { ActiveSession, PaymentSettingsData } from "@/types/settings";
import type { BusinessCategoryOption } from "@/lib/business-categories";

const tabIds = ["profil", "keamanan", "notifikasi", "pembayaran", "privasi", "bahasa"] as const;

interface SettingsViewProps {
  initialData: ProfileData;
  initialNotificationPreferences: NotificationPreferences;
  initialSessions: ActiveSession[];
  businessCategoryOptions: BusinessCategoryOption[];
  initialPaymentSettings: PaymentSettingsData;
  initialTwoFactorEnabled: boolean;
}

export default function SettingsView({
  initialData,
  initialNotificationPreferences,
  initialSessions,
  businessCategoryOptions,
  initialPaymentSettings,
  initialTwoFactorEnabled,
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabIds)[number]>("profil");
  const { dict } = usePreferences();

  const isUmkm = initialData.role === "UMKM";
  const displayName = isUmkm
    ? initialData.businessName || initialData.name
    : initialData.name;

  const pageSubtitle = isUmkm
    ? dict.settings.pageSubtitleUmkm.replace("{businessName}", displayName)
    : dict.settings.pageSubtitle;

  const headerTitle =
    activeTab === "keamanan"
      ? dict.settings.headers.keamanan.title
      : activeTab === "notifikasi"
      ? dict.settings.headers.notifikasi.title
      : activeTab === "privasi"
      ? dict.settings.headers.privasi.title
      : dict.settings.pageTitle;
  const headerSubtitle =
    activeTab === "keamanan"
      ? isUmkm
        ? dict.settings.headers.keamanan.subtitleUmkm
        : dict.settings.headers.keamanan.subtitle
      : activeTab === "notifikasi"
      ? isUmkm
        ? dict.settings.headers.notifikasi.subtitleUmkm
        : dict.settings.headers.notifikasi.subtitle
      : activeTab === "privasi"
      ? isUmkm
        ? dict.settings.headers.privasi.subtitleUmkm
        : dict.settings.headers.privasi.subtitle
      : pageSubtitle;

  return (
    <>
      <PageHeader
        title={headerTitle}
        subtitle={headerSubtitle}
        userName={displayName}
        avatarUrl={initialData.avatarUrl}
      />

      <div className="flex flex-col lg:flex-row gap-6 items-start mt-6">
        {/* Sidebar Tabs — sticky cuma di desktop (lg+); di mobile posisi normal */}
        <div className="static lg:sticky lg:top-24 w-full lg:w-64 shrink-0">
          <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline py-3 pr-3 shadow-sm flex flex-col gap-1 overflow-hidden">
            {tabIds.map((id) => {
              const label =
                id === "profil" && isUmkm ? dict.settings.tabs.profilUmkm : dict.settings.tabs[id];

              return (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex w-full items-center pl-6 pr-4 py-3 text-left text-sm font-medium rounded-r-2xl transition-colors ${
                    activeTab === id
                      ? "bg-[#FFF3ED] dark:bg-brand-soft text-brand font-bold border-l-4 border-brand"
                      : "text-gray-700 dark:text-ink-muted hover:bg-gray-50 dark:hover:bg-void border-l-4 border-transparent"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0 w-full">
          {activeTab === "profil" && (
            <ProfileSettings
              initialData={initialData}
              businessCategoryOptions={businessCategoryOptions}
            />
          )}
          {activeTab === "keamanan" && (
            <SecuritySettingsView sessions={initialSessions} twoFactorEnabled={initialTwoFactorEnabled} />
          )}
          {activeTab === "notifikasi" && (
            <NotificationSettingsCard
              initialPreferences={initialNotificationPreferences}
              isUmkm={isUmkm}
            />
          )}
          {activeTab === "pembayaran" && (
            <PaymentSettingsView data={initialPaymentSettings} />
          )}
          {activeTab === "privasi" && <PrivacySettingsView initialData={initialData} />}
          {activeTab === "bahasa" && <LanguageAppearanceSettings />}
        </div>
      </div>
    </>
  );
}
