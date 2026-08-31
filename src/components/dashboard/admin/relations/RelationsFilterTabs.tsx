import Link from "next/link";

const tabs = [
  { label: "Semua Relasi", value: "semua" },
  { label: "Berlangsung", value: "aktif" },
  { label: "Dalam Review", value: "review" },
  { label: "Selesai", value: "selesai" },
  { label: "Dibatalkan", value: "dibatalkan" },
];

export default function RelationsFilterTabs({ active }: { active: string }) {
  return <div className="flex flex-wrap gap-3">{tabs.map((tab) => <Link key={tab.value} href={tab.value === "semua" ? "/dashboard/relasi" : `/dashboard/relasi?status=${tab.value}`} className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${tab.value === active ? "bg-brand text-white" : "border border-hairline bg-card text-ink hover:border-brand hover:text-brand"}`}>{tab.label}</Link>)}</div>;
}
