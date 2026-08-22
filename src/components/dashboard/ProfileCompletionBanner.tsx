import Link from "next/link";

interface ProfileCompletionBannerProps {
  percent: number;
  role?: "STUDENT" | "UMKM";
}

export default function ProfileCompletionBanner({
  percent,
  role = "STUDENT",
}: ProfileCompletionBannerProps) {
  const isBusiness = role === "UMKM";

  return (
    <div className="flex flex-col gap-6 rounded-xl bg-sidebar px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-display font-black text-white">
          {isBusiness ? "Lengkapi Profil Bisnis Anda" : "Selesaikan Profil Kamu"}
        </h2>
        <p className="mt-1 max-w-md text-sm text-slate-400">
          {isBusiness
            ? "Profil bisnis yang lengkap membantu pelajar memahami kebutuhan dan kredibilitas UMKM Anda."
            : "Lengkapi skill dan portofolio agar rekomendasi proyek menjadi lebih relevan."}
        </p>
      </div>

      <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="w-40">
          <div className="flex items-center justify-between text-xs">
            <span className="text-white">Progres</span>
            <span className="font-bold text-brand text-xs">{percent}%</span>
          </div>
          <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-brand"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>

        <Link
          href="/dashboard/settings"
          className="inline-flex h-9.75 w-54 items-center justify-center whitespace-nowrap rounded-full bg-brand px-6 py-3 font-body text-sm font-black text-white transition-opacity hover:opacity-90"
        >
          LENGKAPI SEKARANG
        </Link>
      </div>
    </div>
  );
}
