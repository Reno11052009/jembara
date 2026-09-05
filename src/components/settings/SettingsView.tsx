"use client";

import { useState, type ElementType } from "react";
import {
  Bell,
  CreditCard,
  Languages,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import SecuritySettingsView from "@/components/security/Securitysettingsview";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { BusinessCategoryOption } from "@/lib/business-categories";
import type { ProfileData } from "@/lib/profile";
import type { NotificationPreferences } from "@/types/notification";
import type { ActiveSession, PaymentSettingsData } from "@/types/settings";
import LanguageAppearanceSettings from "./LanguageAppearanceSettings";
import NotificationSettingsCard from "./NotificationSettingsCard";
import PaymentSettingsView from "./PaymentSettingsView";
import PrivacySettingsView from "./PrivacySettingsView";
import ProfileSettings from "./ProfileSettings";

const tabIds = [
  "profil",
  "keamanan",
  "notifikasi",
  "pembayaran",
  "privasi",
  "bahasa",
] as const;

const tabIcons: Record<(typeof tabIds)[number], ElementType> = {
  profil: User,
  keamanan: ShieldCheck,
  notifikasi: Bell,
  pembayaran: CreditCard,
  privasi: Lock,
  bahasa: Languages,
};

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
  const [activeTab, setActiveTab] =
    useState<(typeof tabIds)[number]>("profil");
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
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-ink">
            {headerTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {headerSubtitle}
          </p>
        </div>
      </div>

      <div
        role="tablist"
        aria-label="Navigasi pengaturan"
        className="flex items-center gap-1 overflow-x-auto rounded-t-2xl border border-b-0 border-gray-100 bg-gray-50 px-4 dark:border-hairline dark:bg-card sm:gap-2"
      >
        {tabIds.map((id) => {
          const isActive = activeTab === id;
          const Icon = tabIcons[id];
          const label = dict.settings.tabs[id];

          return (
            <button
              key={id}
              role="tab"
              id={`settings-tab-${id}`}
              aria-selected={isActive}
              aria-controls={`settings-panel-${id}`}
              aria-label={label}
              onClick={() => setActiveTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-t-xl border-b-4 px-3 py-4 text-sm font-medium transition-colors ${
                isActive
                  ? "border-brand bg-[#FFF3ED] font-bold text-brand dark:bg-brand-soft"
                  : "border-transparent text-gray-700 hover:bg-gray-50 dark:text-ink-muted dark:hover:bg-void dark:hover:text-ink"
              }`}
            >
              <Icon size={18} />
              {isActive && <span>{label}</span>}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`settings-panel-${activeTab}`}
        aria-labelledby={`settings-tab-${activeTab}`}
        className="min-w-0"
      >
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
          />
        )}
        {activeTab === "pembayaran" && (
          <PaymentSettingsView data={initialPaymentSettings} />
        )}
        {activeTab === "privasi" && <PrivacySettingsView initialData={initialData} />}
        {activeTab === "bahasa" && <LanguageAppearanceSettings />}
      </div>
    </>
  );
}
