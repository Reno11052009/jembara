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
//           <div className="bg-white rounded-2xl border border-gray-100 py-3 pr-3 shadow-sm flex flex-col gap-1 overflow-hidden">
//             {tabIds.map((id) => (
//               <button
//                 key={id}
//                 onClick={() => setActiveTab(id)}
//                 className={`flex w-full items-center pl-6 pr-4 py-3 text-left text-sm font-medium rounded-r-2xl transition-colors ${
//                   activeTab === id
//                     ? "bg-[#FFF3ED] text-brand font-bold border-l-4 border-brand"
//                     : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
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
      {/* Bell + avatar tetap baris sendiri di kanan-atas, di luar blok sticky,
         biar posisinya konsisten kayak halaman dashboard lain. */}
      <div className="mb-6 flex items-center justify-end gap-4">
        <NotificationMenu />
        <Link
          href="/dashboard/profile"
          aria-label="Buka profil"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft text-sm font-display font-black text-brand transition-opacity hover:opacity-80"
        >
          {initialData.avatarUrl ? (
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

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Judul halaman + Sidebar Tabs digabung 1 blok, sticky bareng */}
        <div className="sticky top-24 w-full lg:w-64 shrink-0 flex flex-col gap-4">
          <div>
            <h1 className="font-display text-2xl font-black text-ink">
              {dict.settings.pageTitle}
            </h1>
            <p className="mt-1 text-sm text-ink-muted">{dict.settings.pageSubtitle}</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 py-3 pr-3 shadow-sm flex flex-col gap-1 overflow-hidden">
            {tabIds.map((id) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex w-full items-center pl-6 pr-4 py-3 text-left text-sm font-medium rounded-r-2xl transition-colors ${
                  activeTab === id
                    ? "bg-[#FFF3ED] text-brand font-bold border-l-4 border-brand"
                    : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                {dict.settings.tabs[id]}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
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
      </div>
    </>
  );
}
