"use client";

import { useMemo, useRef, useState } from "react";
import { Camera, Globe, Pencil, X } from "lucide-react";
import Swal from "sweetalert2";
import { updateProfileAction } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa";
import SearchableSelect from "@/components/ui/SearchableSelect";
import type { ProfileData } from "@/lib/profile";
import {
  educationLevelOptions,
  educationUsesSemester,
} from "@/lib/education";
import { skillTaxonomy } from "@/lib/skill-taxonomy";
import IndonesiaRegionFields from "@/components/regions/IndonesiaRegionFields";
import type { BusinessCategoryOption } from "@/lib/business-categories";

type ProfileSettingsProps = {
  initialData: ProfileData;
  businessCategoryOptions: BusinessCategoryOption[];
};

export default function ProfileSettings({
  initialData,
  businessCategoryOptions,
}: ProfileSettingsProps) {
  const initialBusinessCategory =
    businessCategoryOptions.find(
      ({ code }) =>
        code.toLocaleLowerCase("id-ID") ===
        initialData.businessCategory.toLocaleLowerCase("id-ID"),
    )?.code ?? initialData.businessCategory;
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string>(initialData.avatarUrl);
  const [avatarBase64, setAvatarBase64] = useState<string | null>(null);
  const [skills, setSkills] = useState<string[]>(initialData.skills || []);
  const [educationLevel, setEducationLevel] = useState(
    initialData.tingkat_pendidikan || "",
  );
  const [businessCategory, setBusinessCategory] = useState(
    initialBusinessCategory || "",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isUmkm = initialData.role === "UMKM";
  const showSemester = educationUsesSemester(educationLevel);
  const hasLegacyEducationLevel =
    Boolean(initialData.tingkat_pendidikan) &&
    !educationLevelOptions.some(
      (option) => option.value === initialData.tingkat_pendidikan,
    );
  const selectableBusinessCategories = useMemo(() => {
    if (
      !initialData.businessCategory ||
      businessCategoryOptions.some(
        ({ code }) =>
          code.toLocaleLowerCase("id-ID") ===
          initialData.businessCategory.toLocaleLowerCase("id-ID"),
      )
    ) {
      return businessCategoryOptions;
    }

    return [
      {
        code: initialData.businessCategory,
        name: `${initialData.businessCategory} (kategori tersimpan)`,
      },
      ...businessCategoryOptions,
    ];
  }, [businessCategoryOptions, initialData.businessCategory]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      void Swal.fire({
        icon: "error",
        title: "Foto tidak valid",
        text: "Pilih gambar PNG, JPEG, atau WebP dengan ukuran maksimal 5 MB.",
        confirmButtonColor: "#f97316",
      });
      e.target.value = "";
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setAvatarPreview(objectUrl);

    const img = new window.Image();
    img.src = objectUrl;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      
      const MAX_SIZE = 500;
      let { width, height } = img;
      
      if (width > height && width > MAX_SIZE) {
        height *= MAX_SIZE / width;
        width = MAX_SIZE;
      } else if (height > MAX_SIZE) {
        width *= MAX_SIZE / height;
        height = MAX_SIZE;
      }
      
      canvas.width = width;
      canvas.height = height;
      ctx?.drawImage(img, 0, 0, width, height);
      
      const webpDataUrl = canvas.toDataURL("image/webp", 0.75);
      if (webpDataUrl.length > 360_000) {
        void Swal.fire({
          icon: "error",
          title: "Foto masih terlalu besar",
          text: "Gunakan gambar yang lebih sederhana atau beresolusi lebih kecil.",
          confirmButtonColor: "#f97316",
        });
        URL.revokeObjectURL(objectUrl);
        return;
      }
      setAvatarPreview(webpDataUrl);
      setAvatarBase64(webpDataUrl);
      URL.revokeObjectURL(objectUrl);
    };
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleAddSkill = async () => {
    if (skills.length >= 20) {
      await Swal.fire({
        icon: "info",
        title: "Batas skill tercapai",
        text: "Maksimal 20 skill dapat ditambahkan.",
        confirmButtonColor: "#FF6B35",
      });
      return;
    }

    const existingSkillKeys = new Set(
      skills.map((skill) => skill.toLocaleLowerCase("id-ID")),
    );
    const availableSkills = skillTaxonomy.filter(
      (skill) => !existingSkillKeys.has(skill.name.toLocaleLowerCase("id-ID")),
    );
    if (availableSkills.length === 0) {
      await Swal.fire({
        icon: "info",
        title: "Semua skill sudah dipilih",
        confirmButtonColor: "#FF6B35",
      });
      return;
    }

    const { value: newSkill } = await Swal.fire({
      title: "Tambah Skill",
      input: "select",
      inputOptions: Object.fromEntries(
        availableSkills.map((skill) => [skill.name, skill.name]),
      ),
      inputPlaceholder: "Pilih skill resmi Jembara",
      showCancelButton: true,
      confirmButtonColor: "#FF6B35",
      confirmButtonText: "Tambah",
      cancelButtonText: "Batal",
      inputValidator: (value) => (value ? undefined : "Pilih salah satu skill."),
    });

    if (newSkill) {
      setSkills([...skills, newSkill]);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    if (!isUmkm) {
      formData.append("skills", skills.join(","));
    }
    if (avatarBase64) {
      formData.append("avatarBase64", avatarBase64);
    }

    try {
      const result = await updateProfileAction(formData);
      if (result?.error) throw new Error(result.error);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil!',
        text: 'Profil Anda telah diperbarui.',
        confirmButtonColor: '#FF6B35'
      }).then(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : 'Gagal menyimpan perubahan.',
        confirmButtonColor: '#FF6B35'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-10">
      {/* Header Avatar Card */}
      <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 shadow-sm flex items-center gap-5">
        <div 
          className="relative group cursor-pointer w-18 h-18 shrink-0" 
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-full h-full rounded-full overflow-hidden border border-gray-200 dark:border-hairline">
            {/* Blob/data URL preview sengaja memakai img agar dapat ditampilkan sebelum disimpan. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={avatarPreview} 
              alt={initialData.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <Camera className="w-5 h-5 text-white" />
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-ink leading-none mb-2.5">
            {initialData.name.split(" ")[0]}
          </h2>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-gray-900 dark:border-ink px-4 py-1.5 text-xs font-semibold text-gray-900 dark:text-ink hover:bg-gray-900 dark:hover:bg-ink hover:text-white dark:hover:text-canvas transition"
          >
            Ganti Foto
          </button>
        </div>
      </div>

      <form onSubmit={handleSaveProfile} className="flex flex-col gap-6">
        {/* Informasi Pribadi Card */}
        <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 lg:p-7 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-ink mb-1">Informasi Pribadi</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                Nama Lengkap <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                defaultValue={initialData.name}
                className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                Email <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                type="email"
                defaultValue={initialData.email || ""}
                placeholder="contoh@email.com"
                className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                disabled
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">Nomor Telepon</label>
              <input
                type="text"
                name="phone"
                defaultValue={initialData.phone || ""}
                placeholder="+62 812-3456-7890"
                className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
              />
            </div>
          </div>

          <IndonesiaRegionFields
            initialValue={{
              addressDetail: initialData.addressDetail,
              provinceCode: initialData.provinceCode,
              provinceName: initialData.provinceName,
              regencyCode: initialData.regencyCode,
              regencyName: initialData.regencyName,
              districtCode: initialData.districtCode,
              districtName: initialData.districtName,
              villageCode: initialData.villageCode,
              villageName: initialData.villageName,
            }}
            allowManualFallback
          />

          <div className="border-t border-gray-100 dark:border-hairline pt-6">
            <h3 className="mb-5 text-lg font-bold text-gray-900 dark:text-ink">
              {isUmkm ? "Informasi Usaha" : "Informasi Pendidikan"}
            </h3>

            {isUmkm ? (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                    Nama Usaha <span className="text-red-500 dark:text-red-400">*</span>
                  </label>
                  <input
                    id="businessName"
                    type="text"
                    name="businessName"
                    defaultValue={initialData.businessName}
                    minLength={3}
                    maxLength={120}
                    autoComplete="organization"
                    placeholder="Contoh: Kopi Jembara"
                    className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    required
                  />
                </div>
                <div>
                  <SearchableSelect
                    id="businessCategory"
                    name="businessCategory"
                    label="Kategori Usaha"
                    value={businessCategory}
                    onChange={setBusinessCategory}
                    options={selectableBusinessCategories}
                    placeholder="Pilih kategori usaha"
                    searchPlaceholder="Cari kategori usaha..."
                    required
                  />
                  {selectableBusinessCategories.length === 0 ? (
                    <p className="mt-1.5 text-xs text-red-600">
                      Master kategori usaha belum tersedia.
                    </p>
                  ) : null}
                </div>
                <div>
                  <label htmlFor="businessWebsite" className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                    Website Usaha
                  </label>
                  <input
                    id="businessWebsite"
                    type="text"
                    name="businessWebsite"
                    defaultValue={initialData.businessWebsite}
                    maxLength={2048}
                    inputMode="url"
                    autoComplete="url"
                    placeholder="tokokamu.id"
                    className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <SearchableSelect
                    id="tingkat_pendidikan"
                    name="tingkat_pendidikan"
                    label="Jenjang Pendidikan"
                    labelClassName="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5"
                    value={educationLevel}
                    onChange={(code) => setEducationLevel(code)}
                    options={[
                      ...(hasLegacyEducationLevel
                        ? [{ code: initialData.tingkat_pendidikan, name: initialData.tingkat_pendidikan }]
                        : []),
                      ...educationLevelOptions.map((option) => ({
                        code: option.value,
                        name: option.label,
                      })),
                    ]}
                    placeholder="Pilih jenjang pendidikan"
                    searchPlaceholder="Cari jenjang..."
                    showSearch={false}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="school" className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">Nama Universitas/Sekolah</label>
                  <input
                    id="school"
                    type="text"
                    name="school"
                    defaultValue={initialData.school}
                    placeholder="Contoh: Universitas Brawijaya"
                    className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label htmlFor="headline" className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">Jurusan</label>
                  <input
                    id="headline"
                    type="text"
                    name="headline"
                    defaultValue={initialData.headline}
                    className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                {showSemester && (
                  <div>
                    <label htmlFor="semester" className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">Semester</label>
                    <input
                      id="semester"
                      type="number"
                      name="semester"
                      defaultValue={initialData.semester ?? ""}
                      min={1}
                      max={20}
                      step={1}
                      placeholder="Contoh: 6"
                      className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
              {isUmkm ? "Deskripsi Usaha" : "Bio"}
            </label>
            <textarea
              name="about"
              rows={2}
              defaultValue={initialData.about}
              className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-y min-h-11.5"
            />
          </div>

          {!isUmkm && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-hairline dark:bg-surface">
              <input type="hidden" name="publicProfileSubmitted" value="1" />
              <label
                htmlFor="isPublicProfile"
                className="flex cursor-pointer items-start gap-3"
              >
                <input
                  id="isPublicProfile"
                  name="isPublicProfile"
                  type="checkbox"
                  defaultChecked={initialData.isPublicProfile}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                />
                <span>
                  <span className="block text-sm font-bold text-gray-900 dark:text-ink">
                    Tampilkan profil di halaman publik
                  </span>
                  <span className="mt-1 block text-xs leading-relaxed text-gray-500 dark:text-ink-muted">
                    Jika diaktifkan, nama, sekolah, jurusan, skill, rating, dan
                    jumlah proyek dapat tampil pada bagian talenta di beranda.
                    Alamat, email, dan nomor telepon tetap tidak ditampilkan.
                  </span>
                </span>
              </label>
            </div>
          )}

          <div className="flex justify-end mt-2">
            <button 
              type="submit" 
              disabled={isLoading}
              className="bg-brand hover:bg-brand-dark text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-sm transition disabled:opacity-70"
            >
              {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
            </button>
          </div>
        </div>

        {/* Skill & Keahlian hanya relevan untuk profil pelajar. */}
        {!isUmkm && <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 lg:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-ink">Skill & Keahlian</h3>
            <button 
              type="button"
              onClick={handleAddSkill}
              className="rounded-full border border-gray-900 dark:border-ink px-4 py-1.5 text-xs font-semibold text-gray-900 dark:text-ink hover:bg-gray-900 dark:hover:bg-ink hover:text-white dark:hover:text-canvas transition whitespace-nowrap"
            >
              + Tambah Skill
            </button>
          </div>
          <div className="flex flex-wrap gap-2.5 mt-2">
            {skills.map((skill) => (
              <div 
                key={skill}
                className="bg-[#F4F4F5] dark:bg-surface hover:bg-gray-200/80 dark:hover:bg-line rounded-full pl-4 pr-1.5 py-1.5 text-xs font-semibold text-gray-700 dark:text-ink-muted flex items-center gap-2 border border-gray-200/50 dark:border-hairline transition cursor-default"
              >
                <span>{skill}</span>
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="w-4 h-4 rounded-full bg-gray-400 dark:bg-line text-white flex items-center justify-center hover:bg-red-500 transition-colors ml-1"
                  title={`Hapus ${skill}`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
            {skills.length === 0 && (
              <p className="text-sm text-gray-500 dark:text-ink-muted italic">Belum ada skill yang ditambahkan.</p>
            )}
          </div>
        </div>}


        {/* Link Portfolio & Sosial Media Card */}
        <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 lg:p-7 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-ink mb-1">Link Portfolio & Sosial Media</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Portfolio */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">Portfolio URL</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="pl-3.5 pr-2 text-gray-400 dark:text-ink-muted">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="portfolioUrl"
                  defaultValue={initialData.portfolioUrl || ""}
                  placeholder="chello.design"
                  className="w-full py-2.5 pr-10 text-sm text-gray-900 dark:text-ink bg-transparent focus:outline-none"
                />
                <div className="absolute right-3.5 text-gray-400 dark:text-ink-muted hover:text-gray-600 dark:hover:text-ink-muted cursor-pointer transition">
                  <Pencil className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">Github</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="pl-3.5 pr-2 text-gray-400 dark:text-ink-muted">
                  <FaGithub className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="github"
                  defaultValue={initialData.github || ""}
                  placeholder="github.com/chello"
                  className="w-full py-2.5 pr-10 text-sm text-gray-900 dark:text-ink bg-transparent focus:outline-none"
                />
                <div className="absolute right-3.5 text-gray-400 dark:text-ink-muted hover:text-gray-600 dark:hover:text-ink-muted cursor-pointer transition">
                  <Pencil className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">Linkedin</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="pl-3.5 pr-2 text-gray-400 dark:text-ink-muted">
                  <FaLinkedin className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="linkedin"
                  defaultValue={initialData.linkedin || ""}
                  placeholder="linkedin.com/in/chello"
                  className="w-full py-2.5 pr-10 text-sm text-gray-900 dark:text-ink bg-transparent focus:outline-none"
                />
                <div className="absolute right-3.5 text-gray-400 dark:text-ink-muted hover:text-gray-600 dark:hover:text-ink-muted cursor-pointer transition">
                  <Pencil className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* Behance */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">Behance</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="pl-3.5 pr-2 text-gray-400 dark:text-ink-muted">
                  <FaBehance className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="behance"
                  defaultValue={initialData.behance || ""}
                  placeholder="behance.net/chello"
                  className="w-full py-2.5 pr-10 text-sm text-gray-900 dark:text-ink bg-transparent focus:outline-none"
                />
                <div className="absolute right-3.5 text-gray-400 dark:text-ink-muted hover:text-gray-600 dark:hover:text-ink-muted cursor-pointer transition">
                  <Pencil className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-white dark:bg-card border-2 border-brand text-brand hover:bg-brand-light font-bold text-sm px-8 py-2 rounded-full transition disabled:opacity-70"
            >
              {isLoading ? "..." : "Simpan"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
