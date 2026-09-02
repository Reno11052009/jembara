"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Laptop, Smartphone, Monitor } from "lucide-react";
import Swal from "sweetalert2";
import { revokeSessionAction } from "@/app/actions/security";
import type { ActiveSession, SessionDeviceType } from "@/types/settings";

const DEVICE_ICON: Record<SessionDeviceType, typeof Laptop> = {
  laptop: Laptop,
  mobile: Smartphone,
  desktop: Monitor,
};

export default function ActiveSessionsCard({
  initialSessions,
}: {
  initialSessions: ActiveSession[];
}) {
  const [sessions, setSessions] = useState(initialSessions);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const router = useRouter();

  const revokeSession = async (session: ActiveSession) => {
    const confirmation = await Swal.fire({
      icon: "warning",
      title: session.isCurrentSession ? "Logout dari perangkat ini?" : "Cabut sesi ini?",
      text: "Perangkat tersebut harus login ulang untuk mengakses Jembara.",
      showCancelButton: true,
      confirmButtonText: "Ya, cabut sesi",
      cancelButtonText: "Batal",
      confirmButtonColor: "#ef4444",
    });
    if (!confirmation.isConfirmed) return;

    setRevokingId(session.id);
    try {
      const result = await revokeSessionAction(session.id);
      if (!result.success) throw new Error(result.error);
      if (result.revokedCurrentSession) {
        router.replace("/login");
        router.refresh();
        return;
      }
      setSessions((current) => current.filter(({ id }) => id !== session.id));
    } catch (error) {
      await Swal.fire({
        icon: "error",
        title: "Sesi gagal dicabut",
        text: error instanceof Error ? error.message : "Silakan coba lagi.",
        confirmButtonColor: "#f97316",
      });
    } finally {
      setRevokingId(null);
    }
  };

  return (
    <section className="rounded-xl border border-[#ECECEC] bg-white dark:bg-card p-6">
      <h2 className="mb-5 font-display text-lg font-bold text-neutral-900 dark:text-ink">
        Sesi Aktif
      </h2>

      {sessions.length === 0 ? (
        <p className="text-sm text-neutral-500 dark:text-ink-muted">Tidak ada sesi aktif lain.</p>
      ) : (
        <div className="divide-y divide-[#ECECEC]">
          {sessions.map((session) => {
            const Icon = DEVICE_ICON[session.deviceType];
            return (
              <div
                key={session.id}
                className="flex items-center justify-between gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-neutral-100 dark:bg-surface">
                    <Icon size={18} className="text-neutral-700 dark:text-ink-muted" />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-body text-sm font-semibold text-neutral-900 dark:text-ink">
                      {session.deviceName}
                    </p>
                    <p className="font-body text-xs text-neutral-500 dark:text-ink-muted">
                      {session.location} · {session.status}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={revokingId === session.id}
                  onClick={() => void revokeSession(session)}
                  className="shrink-0 rounded-full border border-red-200 dark:border-red-500/30 px-4 py-1.5 font-body text-xs font-semibold text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/15 disabled:opacity-50"
                >
                  {revokingId === session.id ? "Memproses..." : "Logout"}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
