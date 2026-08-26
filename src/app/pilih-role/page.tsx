import { User, Store, ArrowRight, Sparkles } from "lucide-react";
import { selectRoleAction } from "@/app/actions/auth";

export default function PilihRolePage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-linear-to-br from-zinc-50 via-white to-zinc-100 p-4 font-sans text-zinc-900 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-brand/5 blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl text-center">
        {/* Header with badge */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand">
          <Sparkles size={14} />
          <span>Pilih Peran Kamu</span>
        </div>

        <h1 className="mb-3 text-4xl font-bold tracking-tight text-zinc-900 md:text-5xl">
          Bergabung sebagai
        </h1>
        <p className="mx-auto mb-10 max-w-md text-base text-zinc-500">
          Pilih peran yang sesuai dengan kebutuhanmu dan mulai perjalanan kolaborasi digital bersama kami.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card Student - Enhanced */}
          <div className="group relative rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl hover:shadow-brand/10">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            
            <div className="relative">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand to-brand/80 text-white shadow-lg shadow-brand/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-brand/40"> 
                <User size={28} />
              </div>
              
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                Pelajar / Mahasiswa
              </h2>
              <p className="mb-7 text-sm text-zinc-500 leading-relaxed">
                Cari pengalaman, kerjakan project nyata, dan bangun portfolio profesionalmu.
              </p>

              <form action={selectRoleAction} className="relative">
                <input type="hidden" name="role" value="STUDENT" />
                <button
                  type="submit"
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-brand hover:shadow-lg hover:shadow-brand/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Pilih Pelajar</span>
                </button>
              </form>
            </div>
          </div>

          {/* Card UMKM - Enhanced */}
          <div className="group relative rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand hover:shadow-xl hover:shadow-brand/10">
            {/* Glow effect */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            <div className="relative">
              <div className="mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand to-brand/80 text-white shadow-lg shadow-brand/25 transition-all duration-300 group-hover:scale-110 group-hover:shadow-brand/40">
                <Store size={28} />
              </div>
              
              <h2 className="mb-2 text-xl font-semibold text-zinc-900">
                Pemilik UMKM
              </h2>
              <p className="mb-7 text-sm text-zinc-500 leading-relaxed">
                Butuh bantuan pelajar bertalenta untuk selesaikan masalah digital bisnismu.
              </p>

              <form action={selectRoleAction} className="relative">
                <input type="hidden" name="role" value="UMKM" />
                <button
                  type="submit"
                  className="group/btn inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:bg-brand hover:shadow-lg hover:shadow-brand/30 hover:scale-[1.02] active:scale-[0.98]"
                >
                  <span>Pilih UMKM</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-8 text-xs text-zinc-400">
          Bergabung gratis • Bisa ubah kapan saja di pengaturan akun
        </p>
      </div>
    </div>
  );
}