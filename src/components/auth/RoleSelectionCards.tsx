"use client";

import { useActionState, useState } from "react";
import { ArrowLeft, LoaderCircle, Store, User } from "lucide-react";
import {
  selectRoleAction,
  type RoleSelectionActionState,
} from "@/app/actions/auth";
<<<<<<< HEAD
import SearchableSelect from "@/components/ui/SearchableSelect";
=======
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
import IndonesiaRegionFields from "@/components/regions/IndonesiaRegionFields";

const initialState: RoleSelectionActionState = {};

<<<<<<< HEAD
const businessCategoryOptions = [
  { value: "kuliner", label: "Kuliner" },
  { value: "fashion", label: "Fashion" },
  { value: "jasa", label: "Jasa" },
  { value: "teknologi", label: "Teknologi" },
  { value: "agribisnis", label: "Agribisnis" },
  { value: "kreatif", label: "Industri Kreatif" },
  { value: "pendidikan", label: "Pendidikan" },
  { value: "kesehatan", label: "Kesehatan" },
  { value: "properti", label: "Properti" },
  { value: "perdagangan", label: "Perdagangan" },
  { value: "hiburan", label: "Hiburan" },
];

=======
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
const inputClassName =
  "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-brand focus:ring-3 focus:ring-brand/10";

export default function RoleSelectionCards() {
  const [showBusinessForm, setShowBusinessForm] = useState(false);
  const [state, formAction, pending] = useActionState(
    selectRoleAction,
    initialState,
  );
<<<<<<< HEAD
  const [website, setWebsite] = useState("");
  const [businessCategory, setBusinessCategory] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  function handleWebsiteChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value.replace(/\s/g, "");
    setWebsite(value);

    const pattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/;

    if (value && !pattern.test(value)) {
      setWebsiteError("Wajib mengandung domain, contoh: tokokamu.com");
    } else {
      setWebsiteError("");
    }



  }
=======

>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
  return (
    <div className="grid items-start gap-6 md:grid-cols-2">
      <div className="group relative rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative">
          <div className="mb-5 inline-flex h-[61.6px] w-[61.6px] items-center justify-center rounded-2xl bg-linear-to-br from-brand to-brand/80 text-white shadow-lg shadow-brand/25">
            <User size={28} />
          </div>

          <h2 className="mb-2 text-xl font-semibold text-zinc-900">
            Pelajar / Mahasiswa
          </h2>
          <p className="mb-7 text-sm leading-relaxed text-zinc-500">
            Cari pengalaman, kerjakan project nyata, dan bangun portfolio profesionalmu.
          </p>

          <form action={formAction}>
            <input type="hidden" name="role" value="STUDENT" />
            <button
              type="submit"
              disabled={pending}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-brand hover:shadow-lg hover:shadow-brand/30 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending && !showBusinessForm ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : null}
              Pilih Pelajar
            </button>
          </form>
        </div>
      </div>

      <div className="group relative rounded-2xl border border-zinc-200 bg-white/80 p-8 shadow-sm backdrop-blur-sm">
        <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-brand/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        <div className="relative">
          <div className="mb-5 inline-flex h-[61.6px] w-[61.6px] items-center justify-center rounded-2xl bg-linear-to-br from-brand to-brand/80 text-white shadow-lg shadow-brand/25">
            <Store size={28} />
          </div>

          <h2 className="mb-2 text-xl font-semibold text-zinc-900">
            Pemilik UMKM
          </h2>
          <p className="mb-7 text-sm leading-relaxed text-zinc-500">
            Temukan pelajar bertalenta untuk membantu digitalisasi dan perkembangan usahamu.
          </p>

          {!showBusinessForm ? (
            <button
              type="button"
              onClick={() => setShowBusinessForm(true)}
              aria-expanded={showBusinessForm}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-medium text-white transition-all duration-300 hover:scale-[1.02] hover:bg-brand hover:shadow-lg hover:shadow-brand/30 active:scale-[0.98]"
            >
              Isi Profil Usaha
            </button>
          ) : (
            <form action={formAction} className="space-y-4 text-left">
              <input type="hidden" name="role" value="UMKM" />

              <div>
                <label htmlFor="businessName" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Nama usaha <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessName"
                  name="businessName"
                  required
                  minLength={3}
                  maxLength={120}
                  autoComplete="organization"
                  placeholder="Contoh: Kopi Jembara"
                  className={inputClassName}
                />
              </div>

              <div>
<<<<<<< HEAD
                <SearchableSelect
                  id="businessCategory"
                  name="businessCategory"
                  label="Kategori usaha"
                  labelClassName="mb-1.5 block text-sm font-semibold text-zinc-700"
                  value={businessCategory}
                  onChange={(code) => setBusinessCategory(code)}
                  options={businessCategoryOptions.map((option) => ({
                    code: option.value,
                    name: option.label,
                  }))}
                  placeholder="Pilih kategori usaha"
                  searchPlaceholder="Cari kategori..."
                  showSearch={true}
                  required
=======
                <label htmlFor="businessCategory" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                  Kategori usaha <span className="text-red-500">*</span>
                </label>
                <input
                  id="businessCategory"
                  name="businessCategory"
                  required
                  minLength={2}
                  maxLength={100}
                  placeholder="Contoh: Kuliner, Fashion, atau Jasa"
                  className={inputClassName}
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
                />
              </div>

              <IndonesiaRegionFields />

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                    Nomor telepon <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    inputMode="numeric"
                    minLength={11}
                    maxLength={11}
                    pattern="[0-9]{11}"
                    title="Nomor telepon harus 11 digit angka"
                    autoComplete="tel"
                    placeholder="08xxxxxxxxxx"
                    onChange={(event) => {
                      event.target.value = event.target.value.replace(/\D/g, "").slice(0, 11);
                    }}
                    className={inputClassName}
                  />
                  {/* TODO (dicatat, belum dikerjakan): kalau nomor diisi format +62,
                     otomatis convert ke 08 setelah dipakai telfon/di-blur. Menyusul. */}
                </div>

                <div>
                  <label htmlFor="website" className="mb-1.5 block text-sm font-semibold text-zinc-700">
                    Website
                  </label>
                  <input
                    id="website"
                    name="website"
                    type="text"
<<<<<<< HEAD
                    value={website}
                    onChange={handleWebsiteChange}
=======
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
                    maxLength={2048}
                    inputMode="url"
                    autoComplete="url"
                    placeholder="tokokamu.id"
<<<<<<< HEAD
                    onKeyDown={(event) => {
                      if (event.key === " ") event.preventDefault();
                    }}
                    className={inputClassName}
                  />
                  {websiteError && (
                    <p className="mt-1 text-xs text-red-500">{websiteError}</p>
                  )}
=======
                    pattern="^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$"
                    title="Wajib mengandung domain, contoh: tokokamu.com"
                    onKeyDown={(event) => {
                      if (event.key === " ") event.preventDefault();
                    }}
                    onChange={(event) => {
                      event.target.value = event.target.value.replace(/\s/g, "");
                    }}
                    className={inputClassName}
                  />
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
                </div>
              </div>

              {state.error ? (
                <p role="alert" aria-live="polite" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {state.error}
                </p>
              ) : null}

              <div className="flex gap-3 pt-1">
                <button
<<<<<<< HEAD
                  type="submit"
                  disabled={pending || Boolean(websiteError)}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 
                  disabled:cursor-not-allowed disabled:opacity-60"
                  >
                  <ArrowLeft size={17} />
                  {pending ? <LoaderCircle size={17} className="animate-spin" /> : null}
                  {pending ? "Menyimpan..." : "Simpan dan Lanjutkan"}
                  </button>
=======
                  type="button"
                  onClick={() => setShowBusinessForm(false)}
                  disabled={pending}
                  className="inline-flex items-center justify-center rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-600 transition hover:border-brand hover:bg-orange-50 hover:text-brand disabled:opacity-60"
                  >
                  <ArrowLeft size={17} />
                </button>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-3 text-sm font-semibold text-white transition hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {pending ? <LoaderCircle size={17} className="animate-spin" /> : null}
                  {pending ? "Menyimpan..." : "Simpan dan Lanjutkan"}
                </button>
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
