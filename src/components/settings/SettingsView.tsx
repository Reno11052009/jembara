// "use client";

// import { useState } from "react";
// import PageHeader from "@/components/layout/PageHeader";
// import ProfileSettings from "./ProfileSettings";
// import SecuritySettingsView from "@/components/security/Securitysettingsview";
// import NotificationSettingsCard from "./NotificationSettingsCard";
// import PaymentSettingsView from "./PaymentSettingsView";
// import PrivacySettingsView from "./PrivacySettingsView";
// import LanguageAppearanceSettings from "./LanguageAppearanceSettings";
// import { usePreferences } from "@/contexts/PreferencesContext";
// import type { ProfileData } from "@/lib/profile";
// import type { NotificationPreferences } from "@/types/notification";
// import type { ActiveSession } from "@/types/settings";

// const tabIds = ["profil", "keamanan", "notifikasi", "pembayaran", "privasi", "bahasa"] as const;

// interface SettingsViewProps {
//   initialData: ProfileData;
//   initialNotificationPreferences: NotificationPreferences;
//   initialSessions: ActiveSession[];
// }

// export default function SettingsView({
//   initialData,
//   initialNotificationPreferences,
//   initialSessions,
// }: SettingsViewProps) {
//   const [activeTab, setActiveTab] = useState<(typeof tabIds)[number]>("profil");
//   const { dict } = usePreferences();

//   return (
//     <>
//       <PageHeader
//         title={dict.settings.pageTitle}
//         subtitle={dict.settings.pageSubtitle}
//         userName={initialData.name}
//         avatarUrl={initialData.avatarUrl}
//       />

//       <div className="flex flex-col lg:flex-row gap-6 items-start">
//         {/* Sidebar Tabs */}
//         <div className="sticky top-24 w-full lg:w-64 shrink-0">
//           <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline py-3 pr-3 shadow-sm flex flex-col gap-1 overflow-hidden">
//             {tabIds.map((id) => (
//               <button
//                 key={id}
//                 onClick={() => setActiveTab(id)}
//                 className={`flex w-full items-center pl-6 pr-4 py-3 text-left text-sm font-medium rounded-r-2xl transition-colors ${
//                   activeTab === id
//                     ? "bg-[#FFF3ED] dark:bg-brand-soft text-brand font-bold border-l-4 border-brand"
//                     : "text-gray-700 dark:text-ink-muted hover:bg-gray-50 dark:hover:bg-void border-l-4 border-transparent"
//                 }`}
//               >
//                 {dict.settings.tabs[id]}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* Content Area */}
//         <div className="flex-1 min-w-0">
//           {activeTab === "profil" && <ProfileSettings initialData={initialData} />}
//           {activeTab === "keamanan" && (
//             <SecuritySettingsView sessions={initialSessions} />
//           )}
//           {activeTab === "notifikasi" && (
//             <NotificationSettingsCard initialPreferences={initialNotificationPreferences} />
//           )}
//           {activeTab === "pembayaran" && <PaymentSettingsView />}
//           {activeTab === "privasi" && <PrivacySettingsView />}
//           {activeTab === "bahasa" && <LanguageAppearanceSettings />}
//         </div>
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import Link from "next/link";
import { User, ShieldCheck, Bell, CreditCard, Lock, Languages } from "lucide-react";
import NotificationMenu from "@/components/layout/NotificationMenu";
import ProfileSettings from "./ProfileSettings";
import SecuritySettingsView from "@/components/security/Securitysettingsview";
import NotificationSettingsCard from "./NotificationSettingsCard";
import PaymentSettingsView from "./PaymentSettingsView";
import PrivacySettingsView from "./PrivacySettingsView";
import LanguageAppearanceSettings from "./LanguageAppearanceSettings";
import { usePreferences } from "@/contexts/PreferencesContext";
import type { ProfileData } from "@/lib/profile";
import type { NotificationPreferences } from "@/types/notification";
import type { ActiveSession } from "@/types/settings";
import type { BusinessCategoryOption } from "@/lib/business-categories";

const tabIds = ["profil", "keamanan", "notifikasi", "pembayaran", "privasi", "bahasa"] as const;

// Icon per tab — belum pernah dikonfirmasi user, gampang diganti di sini kalau maunya beda.
const tabIcons: Record<(typeof tabIds)[number], React.ElementType> = {
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
}

export default function SettingsView({
  initialData,
  initialNotificationPreferences,
  initialSessions,
  businessCategoryOptions,
}: SettingsViewProps) {
  const [activeTab, setActiveTab] = useState<(typeof tabIds)[number]>("profil");
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
          <p className="mt-1 text-sm text-ink-muted">{dict.settings.pageSubtitle}</p>
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

      {/*
        Tab bar horizontal — dipakai di semua breakpoint, ganti total
        sidebar vertikal side-by-side yang lama. Cuma tab aktif yang
        nampilin label; sisanya icon-only (sesuai referensi).
      */}
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

      {/* Content Area */}
      <div
        role="tabpanel"
        id={`settings-panel-${activeTab}`}
        aria-labelledby={`settings-tab-${activeTab}`}
        className="rounded-b-2xl border border-t-0 border-gray-100 bg-white p-6 shadow-sm dark:border-hairline dark:bg-card"
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
          <NotificationSettingsCard initialPreferences={initialNotificationPreferences} />
        )}
        {activeTab === "pembayaran" && <PaymentSettingsView />}
        {activeTab === "privasi" && <PrivacySettingsView />}
        {activeTab === "bahasa" && <LanguageAppearanceSettings />}
      </div>
    </>
  );
}