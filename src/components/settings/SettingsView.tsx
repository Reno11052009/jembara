"use client";

import { useState, type ElementType } from "react";
import Link from "next/link";
import {
  Bell,
  CreditCard,
  Languages,
  Lock,
  ShieldCheck,
  User,
} from "lucide-react";
import NotificationMenu from "@/components/layout/NotificationMenu";
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
}

export default function SettingsView({
  initialData,
  initialNotificationPreferences,
  initialSessions,
  businessCategoryOptions,
  initialPaymentSettings,
}: SettingsViewProps) {
  const [activeTab, setActiveTab] =
    useState<(typeof tabIds)[number]>("profil");
  const { dict } = usePreferences();

  const initials = initialData.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-ink">
            {dict.settings.pageTitle}
          </h1>
          <p className="mt-1 text-sm text-ink-muted">
            {dict.settings.pageSubtitle}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <NotificationMenu />
          <Link
            href="/dashboard/profile"
            aria-label="Buka profil"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-display font-black text-brand transition-opacity hover:opacity-80"
          >
            {initialData.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={initialData.avatarUrl}
                alt={`Foto profil ${initialData.name}`}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </Link>
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
          <SecuritySettingsView sessions={initialSessions} />
        )}
        {activeTab === "notifikasi" && (
          <NotificationSettingsCard
            initialPreferences={initialNotificationPreferences}
          />
        )}
        {activeTab === "pembayaran" && (
          <PaymentSettingsView data={initialPaymentSettings} />
        )}
        {activeTab === "privasi" && <PrivacySettingsView />}
        {activeTab === "bahasa" && <LanguageAppearanceSettings />}
      </div>
    </>
  );
}
