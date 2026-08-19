import Button from "@/components/ui/Button";

interface ProfileCompletionBannerProps {
  percent: number;
}

export default function ProfileCompletionBanner({
  percent,
}: ProfileCompletionBannerProps) {
  return (
    <div className="flex flex-col gap-6 rounded-xl bg-sidebar px-6 py-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-base font-display font-black text-white">Selesaikan Profil Kamu</h2>
        <p className="mt-1 max-w-md text-sm text-slate-400">
          Lengkapi portofolio dan verifikasi mahasiswa untuk meningkatkan
          kesempatan dilirik UMKM hingga 2x lipat!
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

        <Button
          variant="primary"
          className="h-9.75 w-54 whitespace-nowrap rounded-full px-6 py-3 font-body text-sm font-black"
        >
          LENGKAPI SEKARANG
        </Button>
      </div>
    </div>
  );
}
