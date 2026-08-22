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

const tabIds = ["profil", "keamanan", "notifikasi", "pembayaran", "privasi", "bahasa"] as const;

export default function SettingsView({ initialData }: { initialData: ProfileData }) {
  const [activeTab, setActiveTab] = useState<(typeof tabIds)[number]>("profil");
  const { dict } = usePreferences();

  return (
    <>
      <PageHeader
        title={dict.settings.pageTitle}
        subtitle={dict.settings.pageSubtitle}
        userName={initialData.name}
        avatarUrl={initialData.avatarUrl}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 py-3 pr-3 shadow-sm flex flex-col gap-1 overflow-hidden">
            {tabIds.map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex w-full items-center pl-6 pr-4 py-3 text-left text-sm font-medium rounded-r-2xl transition-colors ${
                  activeTab === id
                    ? "bg-[#FFF3ED] text-[#FF6B35] font-bold border-l-[4px] border-[#FF6B35]"
                    : "text-gray-700 hover:bg-gray-50 border-l-[4px] border-transparent"
                }`}
              >
                {dict.settings.tabs[id]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === "profil" && <ProfileSettings initialData={initialData} />}
          {activeTab === "keamanan" && <SecuritySettingsView />}
          {activeTab === "notifikasi" && <NotificationSettingsCard />}
          {activeTab === "pembayaran" && <PaymentSettingsView />}
          {activeTab === "privasi" && <PrivacySettingsView />}
          {activeTab === "bahasa" && <LanguageAppearanceSettings />}
        </div>
      </div>
    </>
  );
}
