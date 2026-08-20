"use client";

import { useState } from "react";
import PageHeader from "@/components/layout/PageHeader";
import ProfileSettings from "./ProfileSettings";

const tabs = [
  { id: "profil", label: "Profil" },
  { id: "keamanan", label: "Keamanan" },
  { id: "notifikasi", label: "Notifikasi" },
  { id: "pembayaran", label: "Pembayaran" },
  { id: "privasi", label: "Privasi" },
  { id: "bahasa", label: "Bahasa & Tampilan" },
];

export default function SettingsView({ initialData }: { initialData: any }) {
  const [activeTab, setActiveTab] = useState("profil");

  return (
    <>
      <PageHeader
        title="Settings"
        subtitle="Kelola akun dan preferensi kamu."
        userName={initialData.name}
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full lg:w-64 shrink-0">
          <div className="bg-white rounded-2xl border border-gray-100 p-2 shadow-sm flex flex-col gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex w-full items-center px-4 py-3 text-left text-sm font-medium rounded-xl transition-colors ${
                  activeTab === tab.id
                    ? "bg-orange-50 text-[#FF6B35] font-semibold border-l-4 border-[#FF6B35]"
                    : "text-gray-700 hover:bg-gray-50 border-l-4 border-transparent"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
          {activeTab === "profil" && <ProfileSettings initialData={initialData} />}
          {activeTab !== "profil" && (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm text-center flex flex-col items-center justify-center h-64">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Segera Hadir</h3>
              <p className="text-gray-500 text-sm">
                Fitur pengaturan {tabs.find((t) => t.id === activeTab)?.label} sedang dalam tahap pengembangan.
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
