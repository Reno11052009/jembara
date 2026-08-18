import { User, Store } from "lucide-react";
import { selectRoleAction } from "@/app/actions/auth";

export default function PilihRolePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 p-4 font-sans text-zinc-900">
      <div className="w-full max-w-2xl text-center">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-zinc-900">Pilih Peran Kamu</h1>
        <p className="mb-8 text-zinc-500">
          Untuk memberikan pengalaman terbaik, beritahu kami siapa kamu.
        </p>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Card Student */}
          <div className="flex h-full flex-col group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-brand hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
              <User size={24} />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-zinc-900">Saya Pelajar / Mahasiswa</h2>
            <p className="mb-6 text-sm text-zinc-500">
              Saya ingin mencari pengalaman, mengerjakan project nyata, dan membangun portfolio.
            </p>
            <form action={selectRoleAction} className="mt-auto">
              <input type="hidden" name="role" value="STUDENT" />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Pilih Pelajar
              </button>
            </form>
          </div>

          {/* Card UMKM */}
          <div className="flex h-full flex-col group relative rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:border-brand hover:shadow-md">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-brand group-hover:bg-brand group-hover:text-white transition-colors">
              <Store size={24} />
            </div>
            <h2 className="mb-2 text-xl font-semibold text-zinc-900">Saya Pemilik UMKM</h2>
            <p className="mb-6 text-sm text-zinc-500">
              Saya butuh bantuan pelajar bertalenta untuk menyelesaikan masalah digital bisnis saya.
            </p>
            <form action={selectRoleAction} className="mt-auto">
              <input type="hidden" name="role" value="UMKM" />
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
              >
                Pilih UMKM
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
