import { MessageSquare, ShieldAlert, TrendingUp } from "lucide-react";
import type { AdminStat } from "@/types/admin-dashboard";
import type { ReportedConversation, TransactionMessage } from "@/types/admin-chat-monitoring";

export const chatMonitoringStats: AdminStat[] = [
  { id: "total", label: "Total Percakapan", value: "5,820", icon: MessageSquare },
  { id: "masuk", label: "Pesan Masuk Hari Ini", value: "24,190", icon: TrendingUp },
  {
    id: "laporan",
    label: "Laporan Pelanggaran (Pending)",
    value: "12 Laporan",
    icon: ShieldAlert,
  },
];

export const reportedConversations: ReportedConversation[] = [
  {
    id: "1",
    participantsLabel: "Heri S. x Rian H.",
    previewMessage: '"Saya transfer langsung di luar Jembatan Karya saja ya..."',
    tag: "sensitif",
  },
  {
    id: "2",
    participantsLabel: "Budi S. x Chello S.",
    previewMessage: '"Terima kasih, wireframe sudah saya pelajari..."',
    tag: "aman",
  },
];

export const reportedTransactionMessages: TransactionMessage[] = [
  {
    id: "1",
    senderName: "Heri Susanto",
    senderRole: "(Owner UMKM)",
    content:
      "Halo Rian, untuk pembayaran proyek ini bagaimana kalau langsung via rekening pribadi saya saja? Biar potongannya tidak besar di platform.",
  },
  {
    id: "2",
    senderName: "Rian Hidayat",
    senderRole: "(Talent)",
    content:
      "Boleh Pak, saya kirim nomor rekening saya ya. Bank BCA **** 4829 atas nama Rian Hidayat. Nanti saya kabari kalau sudah ditransfer.",
    flagged: true,
    flaggedLabel: "[TERLAPORKAN]",
    detectionNote: "Pemicu deteksi otomatis: Transaksi luar platform",
  },
];
