import type { ActiveSession } from "@/types/settings";

export const mockActiveSessions: ActiveSession[] = [
  {
    id: "session-1",
    deviceName: "MacBook Pro 14 inch",
    deviceType: "laptop",
    location: "Malang, Indonesia",
    status: "Aktif Sekarang (Sesi ini)",
    isCurrentSession: true,
  },
  {
    id: "session-2",
    deviceName: "iPhone 15 Pro",
    deviceType: "mobile",
    location: "Malang, Indonesia",
    status: "Terakhir aktif: 2 jam yang lalu",
    isCurrentSession: false,
  },
  {
    id: "session-3",
    deviceName: "Chrome OS Desktop",
    deviceType: "desktop",
    location: "Surabaya, Indonesia",
    status: "Terakhir aktif: 3 hari yang lalu",
    isCurrentSession: false,
  },
];