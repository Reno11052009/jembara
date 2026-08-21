import { Laptop, Smartphone, Monitor } from "lucide-react";
import { mockActiveSessions } from "@/lib/mock-security-settings";
import type { SessionDeviceType } from "@/types/settings";

const DEVICE_ICON: Record<SessionDeviceType, typeof Laptop> = {
  laptop: Laptop,
  mobile: Smartphone,
  desktop: Monitor,
};

export default function ActiveSessionsCard() {
  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white p-6">
      <h2 className="font-display text-lg font-bold text-neutral-900 mb-5">
        Sesi Aktif
      </h2>

      <div className="divide-y divide-[#ECECEC]">
        {mockActiveSessions.map((session) => {
          const Icon = DEVICE_ICON[session.deviceType];

          return (
            <div
              key={session.id}
              className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-md bg-neutral-100 flex items-center justify-center shrink-0">
                  <Icon size={18} className="text-neutral-700" />
                </div>
                <div>
                  <p className="font-body text-sm font-semibold text-neutral-900">
                    {session.deviceName}
                  </p>
                  <p className="font-body text-xs text-neutral-500">
                    {session.location} • {session.status}
                  </p>
                </div>
              </div>

              <button
                type="button"
                className="font-body text-xs font-semibold text-red-500 border border-red-200 rounded-full px-4 py-1.5 hover:bg-red-50 transition-colors shrink-0"
              >
                Logout
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}