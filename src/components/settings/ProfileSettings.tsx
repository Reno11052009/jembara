"use client";

import { useMemo, useRef, useState } from "react";
import { Camera, Globe, Pencil, X } from "lucide-react";
import Swal from "sweetalert2";
import { updateProfileAction } from "@/app/actions/profile";
import { useRouter } from "next/navigation";
import { FaBehance, FaGithub, FaLinkedin } from "react-icons/fa";
import SearchableSelect from "@/components/ui/SearchableSelect";
import { createRoot, type Root } from "react-dom/client";
import FormattedNumericInput from "@/components/ui/FormattedNumericInput";
import type { ProfileData } from "@/lib/profile";
import {
  educationLevelOptions,
  educationUsesSemester,
} from "@/lib/education";
import { skillTaxonomy } from "@/lib/skill-taxonomy";
import IndonesiaRegionFields from "@/components/regions/IndonesiaRegionFields";
import type { BusinessCategoryOption } from "@/lib/business-categories";

function SwalSearchableSelect({
  options,
  onChange,
  label,
  placeholder,
  searchPlaceholder,
}: {
  options: { code: string; name: string }[];
  onChange: (val: string) => void;
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
}) {
  const [val, setVal] = useState("");
  return (
    <SearchableSelect
      id="swal-skill-select"
      label={label || "Pilih skill resmi dari Jembara"}
      value={val}
      onChange={(selected) => {
        setVal(selected);
        onChange(selected);
      }}
      options={options}
      placeholder={placeholder || "Pilih skill resmi Jembara"}
      searchPlaceholder={searchPlaceholder || "Cari skill (mis. React, UI/UX...)"}
      required
      showSearch
    />
  );
}

type ProfileSettingsProps = {
  initialData: ProfileData;
  businessCategoryOptions: BusinessCategoryOption[];
};

import { usePreferences } from "@/contexts/PreferencesContext";

export default function ProfileSettings({
  initialData,
  businessCategoryOptions,
}: ProfileSettingsProps) {
  const { dict } = usePreferences();
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
  const [skillLevels, setSkillLevels] = useState<Record<string, string>>(initialData.skillLevels || {});
  const [educationLevel, setEducationLevel] = useState(
    initialData.tingkat_pendidikan || "",
  );
  const [businessCategory, setBusinessCategory] = useState(
    initialBusinessCategory || "",
  );
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const isUmkm = initialData.role === "UMKM";
  const displayName = isUmkm
    ? initialData.businessName || initialData.name
    : initialData.name;

  const formatDots = (val: number | string | null | undefined) => {
    if (!val) return "";
    const raw = String(val).replace(/\D/g, "");
    return raw ? new Intl.NumberFormat("id-ID").format(Number(raw)) : "";
  };

  const [expectedBudgetMin, setExpectedBudgetMin] = useState(formatDots(initialData.expectedBudgetMin));
  const [expectedBudgetMax, setExpectedBudgetMax] = useState(formatDots(initialData.expectedBudgetMax));
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

  const profDict = dict.settingsCards.profile;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      void Swal.fire({
        icon: "error",
        title: profDict.invalidPhotoTitle,
        text: profDict.invalidPhotoText,
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
          title: profDict.photoTooLargeTitle,
          text: profDict.photoTooLargeText,
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
    setSkillLevels((current) => { const next = { ...current }; delete next[skillToRemove]; return next; });
  };

  const handleAddSkill = async () => {
    if (skills.length >= 20) {
      await Swal.fire({
        icon: "info",
        title: profDict.skillLimitTitle,
        text: profDict.skillLimitText,
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
        title: profDict.allSkillsSelectedTitle,
        confirmButtonColor: "#FF6B35",
      });
      return;
    }

    let selectedSkillValue = "";
    let rootInstance: Root | null = null;

    const options = availableSkills.map((skill) => ({
      code: skill.name,
      name: skill.name,
    }));

    const { value: newSkill } = await Swal.fire({
      title: profDict.addSkillModalTitle,
      html: '<div id="swal-skill-mount-container" class="text-left my-2"></div>',
      showCancelButton: true,
      confirmButtonColor: "#FF6B35",
      confirmButtonText: profDict.addSkillModalConfirm,
      cancelButtonText: dict.common.cancel,
      didOpen: () => {
        const popup = Swal.getPopup();
        if (popup) popup.style.overflow = "visible";
        const htmlContainer = Swal.getHtmlContainer();
        if (htmlContainer) htmlContainer.style.overflow = "visible";

        const mountPoint = document.getElementById("swal-skill-mount-container");
        if (mountPoint) {
          rootInstance = createRoot(mountPoint);
          rootInstance.render(
            <SwalSearchableSelect
              options={options}
              label={profDict.selectOfficialSkill}
              placeholder={profDict.selectOfficialSkill}
              searchPlaceholder={profDict.searchSkillPlaceholder}
              onChange={(val) => {
                selectedSkillValue = val;
              }}
            />,
          );
        }
      },
      willClose: () => {
        if (rootInstance) {
          rootInstance.unmount();
        }
      },
      preConfirm: () => {
        if (!selectedSkillValue) {
          Swal.showValidationMessage(profDict.addSkillModalValidation);
          return false;
        }
        return selectedSkillValue;
      },
    });

    if (newSkill) {
      setSkills((prev) => [...prev, newSkill]);
      setSkillLevels((current) => ({ ...current, [newSkill]: "BEGINNER" }));
    }
  };

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    const formData = new FormData(e.currentTarget);
    if (!isUmkm) {
      formData.append("skills", skills.join(","));
      formData.append("skillLevels", JSON.stringify(skillLevels));
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
        text: profDict.saveSuccess,
        confirmButtonColor: '#FF6B35'
      }).then(() => {
        router.refresh();
      });
    } catch (err: unknown) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : profDict.saveError,
        confirmButtonColor: '#FF6B35'
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Perusahaan (UMKM) belum punya foto logo asli — sementara tampilkan
  // inisial nama perusahaan sebagai placeholder visual, bukan foto sungguhan.
  const companyInitials = displayName
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  if (isUmkm) {
    return (
      <div suppressHydrationWarning className="flex flex-col gap-6 pb-10">
        {/* Header Logo Card — Perusahaan */}
        <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 shadow-sm flex items-center gap-5">
          <div
            className="relative group cursor-pointer w-18 h-18 shrink-0"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-full h-full rounded-full overflow-hidden border border-gray-200 dark:border-hairline bg-brand-soft flex items-center justify-center">
              {avatarPreview && !avatarPreview.includes("ui-avatars.com") ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarPreview}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="font-display text-lg font-black text-brand">
                  {companyInitials}
                </span>
              )}
            </div>
            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-5 h-5 text-white" />
            </div>
            <input
              suppressHydrationWarning
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-gray-900 dark:text-ink leading-none mb-2.5">
              {displayName}
            </h2>
            <button
              suppressHydrationWarning
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-gray-900 dark:border-ink px-4 py-1.5 text-xs font-body font-semibold text-gray-900 dark:text-ink hover:bg-gray-900 dark:hover:bg-ink hover:text-white dark:hover:text-canvas transition"
            >
              {profDict.changeLogo}
            </button>
          </div>
        </div>

        <form suppressHydrationWarning onSubmit={handleSaveProfile} className="flex flex-col gap-6">
          {/* "Nama Lengkap" tidak ditampilkan untuk perusahaan — dikirim
              tersembunyi agar validasi backend (name wajib diisi) tetap lolos. */}
          <input suppressHydrationWarning type="hidden" name="name" value={initialData.name} />

          {/* Profil Perusahaan Card */}
          <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 lg:p-7 shadow-sm flex flex-col gap-5">
            <h3 className="font-display text-lg font-bold text-gray-900 dark:text-ink mb-1">
              {profDict.companyProfileTitle}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                  {profDict.companyNameLabel} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  id="businessName"
                  type="text"
                  name="businessName"
                  defaultValue={initialData.businessName}
                  minLength={3}
                  maxLength={120}
                  autoComplete="organization"
                  placeholder="Contoh: Java Woodcraft"
                  className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm font-body text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  required
                />
              </div>
              <div>
                <SearchableSelect
                  id="businessCategory"
                  name="businessCategory"
                  label={profDict.industryLabel}
                  value={businessCategory}
                  onChange={setBusinessCategory}
                  options={selectableBusinessCategories}
                  placeholder="Pilih industri / kategori usaha"
                  searchPlaceholder="Cari industri / kategori..."
                  required
                />
                {selectableBusinessCategories.length === 0 ? (
                  <p className="mt-1.5 text-xs font-body text-red-600">
                    Master kategori usaha belum tersedia.
                  </p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                  {profDict.companyEmailLabel} <span className="text-red-500 dark:text-red-400">*</span>
                </label>
                <input
                  suppressHydrationWarning
                  type="email"
                  defaultValue={initialData.email || ""}
                  placeholder="contact@perusahaan.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm font-body text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  disabled
                />
              </div>
              <div>
                <label className="block font-body text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                  {profDict.phoneNumberLabel}
                </label>
                <input
                  suppressHydrationWarning
                  type="text"
                  name="phone"
                  defaultValue={initialData.phone || ""}
                  placeholder="+62 812-3456-7890"
                  className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm font-body text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div>
              <h4 className="mb-3 font-body text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase">
                {profDict.mainAddressTitle}
              </h4>
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
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label htmlFor="businessWebsite" className="block font-body text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                  {profDict.officialWebsiteLabel}
                </label>
                <input
                  suppressHydrationWarning
                  id="businessWebsite"
                  type="text"
                  name="businessWebsite"
                  defaultValue={initialData.businessWebsite}
                  maxLength={2048}
                  inputMode="url"
                  autoComplete="url"
                  placeholder="www.javawoodcraft.com"
                  className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm font-body text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="employeeCount" className="block font-body text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                  {profDict.employeeCountLabel}
                </label>
                <input
                  suppressHydrationWarning
                  id="employeeCount"
                  type="text"
                  name="employeeCount"
                  placeholder="Contoh: 11 - 50 Karyawan"
                  className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm font-body text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
              <div>
                <label htmlFor="foundedYear" className="block font-body text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                  {profDict.foundedYearLabel}
                </label>
                <input
                  suppressHydrationWarning
                  id="foundedYear"
                  type="number"
                  name="foundedYear"
                  min={1900}
                  max={new Date().getFullYear()}
                  placeholder="Contoh: 2018"
                  className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm font-body text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                />
              </div>
            </div>

            <div>
              <label className="block font-body text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                {profDict.companyDescriptionLabel}
              </label>
              <textarea
                suppressHydrationWarning
                name="about"
                rows={3}
                defaultValue={initialData.about}
                className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm font-body text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-y min-h-11.5"
              />
            </div>

            <div className="flex justify-end mt-2">
              <button
                suppressHydrationWarning
                type="submit"
                disabled={isLoading}
                className="bg-brand hover:bg-brand-dark text-white font-body font-bold text-sm px-6 py-2.5 rounded-full shadow-sm transition disabled:opacity-70"
              >
                {isLoading ? profDict.saving : profDict.saveProfileButton}
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="flex flex-col gap-6 pb-10">
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
            suppressHydrationWarning
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
            suppressHydrationWarning
            onClick={() => fileInputRef.current?.click()}
            className="rounded-full border border-gray-900 dark:border-ink px-4 py-1.5 text-xs font-semibold text-gray-900 dark:text-ink hover:bg-gray-900 dark:hover:bg-ink hover:text-white dark:hover:text-canvas transition"
          >
            {profDict.changePhoto}
          </button>
        </div>
      </div>

      <form suppressHydrationWarning onSubmit={handleSaveProfile} className="flex flex-col gap-6">
        {/* Informasi Pribadi Card */}
        <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 lg:p-7 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-ink mb-1">{profDict.personalInfoTitle}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                {profDict.fullNameLabel} <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                suppressHydrationWarning
                type="text"
                name="name"
                defaultValue={initialData.name}
                className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                {profDict.emailLabel} <span className="text-red-500 dark:text-red-400">*</span>
              </label>
              <input
                suppressHydrationWarning
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
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">{profDict.phoneLabel}</label>
              <input
                suppressHydrationWarning
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
              {profDict.educationInfoTitle}
            </h3>

            {(
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <SearchableSelect
                    id="tingkat_pendidikan"
                    name="tingkat_pendidikan"
                    label={profDict.educationLevelLabel}
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
                    placeholder={profDict.educationLevelPlaceholder}
                    searchPlaceholder={dict.common.search}
                    showSearch={false}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="school" className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                    <span className="inline-flex items-center gap-1">
                      {profDict.schoolLabel}
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </span>
                  </label>
                  <input
                    suppressHydrationWarning
                    id="school"
                    type="text"
                    name="school"
                    defaultValue={initialData.school}
                    placeholder={profDict.schoolPlaceholder}
                    className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                <div>
                  <label htmlFor="headline" className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
                    <span className="inline-flex items-center gap-1">
                      {profDict.majorLabel}
                      <span className="text-red-500 dark:text-red-400">*</span>
                    </span>
                  </label>
                  <input
                    suppressHydrationWarning
                    id="headline"
                    type="text"
                    name="headline"
                    defaultValue={initialData.headline}
                    className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                  />
                </div>
                {showSemester && (
                  <div>
                    <label htmlFor="semester" className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">{profDict.semesterLabel}</label>
                    <input
                      suppressHydrationWarning
                      id="semester"
                      type="number"
                      name="semester"
                      defaultValue={initialData.semester ?? ""}
                      min={1}
                      max={20}
                      step={1}
                      placeholder={profDict.semesterPlaceholder}
                      className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">
              <span className="inline-flex items-center gap-1">
                {profDict.bioLabel}
                <span className="text-red-500 dark:text-red-400">*</span>
              </span>
            </label>
            <textarea
              suppressHydrationWarning
              name="about"
              rows={2}
              defaultValue={initialData.about}
              className="w-full rounded-xl border border-gray-200 dark:border-hairline px-4 py-2.5 text-sm text-gray-900 dark:text-ink focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand resize-y min-h-11.5"
            />
          </div>

          {!isUmkm && (
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-hairline dark:bg-surface">
                <input suppressHydrationWarning type="hidden" name="availabilitySubmitted" value="1" />
                <label htmlFor="available" className="flex cursor-pointer items-start gap-3">
                  <input
                    suppressHydrationWarning
                    id="available"
                    name="available"
                    type="checkbox"
                    defaultChecked={initialData.available}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span>
                    <span className="block text-sm font-bold text-gray-900 dark:text-ink">
                      {profDict.availableForProjects}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-500 dark:text-ink-muted">
                      {profDict.availableForProjectsDesc}
                    </span>
                  </span>
                </label>
              </div>

              <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-hairline dark:bg-surface">
                <input suppressHydrationWarning type="hidden" name="publicProfileSubmitted" value="1" />
                <label
                  htmlFor="isPublicProfile"
                  className="flex cursor-pointer items-start gap-3"
                >
                  <input
                    suppressHydrationWarning
                    id="isPublicProfile"
                    name="isPublicProfile"
                    type="checkbox"
                    defaultChecked={initialData.isPublicProfile}
                    className="mt-1 h-4 w-4 rounded border-gray-300 text-brand focus:ring-brand"
                  />
                  <span>
                    <span className="block text-sm font-bold text-gray-900 dark:text-ink">
                      {profDict.publicProfile}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-gray-500 dark:text-ink-muted">
                      {profDict.publicProfileDesc}
                    </span>
                  </span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-end mt-2">
            <button 
              suppressHydrationWarning
              type="submit" 
              disabled={isLoading}
              className="bg-brand hover:bg-brand-dark text-white font-bold text-sm px-6 py-2.5 rounded-full shadow-sm transition disabled:opacity-70"
            >
              {isLoading ? profDict.saving : profDict.saveProfileButton}
            </button>
          </div>
        </div>

        {/* Skill & Keahlian — khusus profil pelajar. */}
        <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 lg:p-7 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-ink">{profDict.skillsTitle}</h3>
            <button 
              suppressHydrationWarning
              type="button"
              onClick={handleAddSkill}
              className="rounded-full border border-gray-900 dark:border-ink px-4 py-1.5 text-xs font-semibold text-gray-900 dark:text-ink hover:bg-gray-900 dark:hover:bg-ink hover:text-white dark:hover:text-canvas transition whitespace-nowrap"
            >
              {profDict.addSkillButton}
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
                  suppressHydrationWarning
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
              <p className="text-sm text-gray-500 dark:text-ink-muted italic">{profDict.noSkillsAdded}</p>
            )}
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            {skills.map((skill) => (
              <div key={`${skill}-level`}>
                <SearchableSelect
                  id={`skill-level-${skill}`}
                  label={`Level ${skill}`}
                  labelClassName="block text-xs font-semibold text-ink-muted mb-1"
                  value={skillLevels[skill] || "BEGINNER"}
                  onChange={(val) =>
                    setSkillLevels((current) => ({ ...current, [skill]: val }))
                  }
                  options={[
                    { code: "BEGINNER", name: "Beginner" },
                    { code: "INTERMEDIATE", name: "Intermediate" },
                    { code: "ADVANCED", name: "Advanced" },
                  ]}
                  placeholder="Pilih level skill"
                  showSearch={false}
                />
              </div>
            ))}
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <label className="block text-xs font-semibold text-ink-muted">
              {profDict.minBudgetExpectation}
              <FormattedNumericInput
                value={expectedBudgetMin}
                onValueChange={setExpectedBudgetMin}
                placeholder={profDict.minBudgetPlaceholder}
                className="mt-1 w-full rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink text-right"
              />
              <input suppressHydrationWarning type="hidden" name="expectedBudgetMin" value={expectedBudgetMin.replace(/\D/g, "")} />
            </label>
            <label className="block text-xs font-semibold text-ink-muted">
              {profDict.maxBudgetExpectation}
              <FormattedNumericInput
                value={expectedBudgetMax}
                onValueChange={setExpectedBudgetMax}
                placeholder={profDict.maxBudgetPlaceholder}
                className="mt-1 w-full rounded-lg border border-hairline bg-card px-3 py-2 text-sm text-ink text-right"
              />
              <input suppressHydrationWarning type="hidden" name="expectedBudgetMax" value={expectedBudgetMax.replace(/\D/g, "")} />
            </label>
          </div>
        </div>


        {/* Link Portfolio & Sosial Media Card */}
        <div className="bg-white dark:bg-card rounded-2xl border border-gray-100 dark:border-hairline p-6 lg:p-7 shadow-sm flex flex-col gap-5">
          <h3 className="text-lg font-bold text-gray-900 dark:text-ink mb-1">{profDict.portfolioAndSocialTitle}</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Portfolio */}
            <div>
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">{profDict.portfolioUrlLabel}</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="pl-3.5 pr-2 text-gray-400 dark:text-ink-muted">
                  <Globe className="w-4 h-4" />
                </div>
                <input
                  suppressHydrationWarning
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
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">{profDict.githubLabel}</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="pl-3.5 pr-2 text-gray-400 dark:text-ink-muted">
                  <FaGithub className="w-4 h-4" />
                </div>
                <input
                  suppressHydrationWarning
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
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">{profDict.linkedinLabel}</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="pl-3.5 pr-2 text-gray-400 dark:text-ink-muted">
                  <FaLinkedin className="w-4 h-4" />
                </div>
                <input
                  suppressHydrationWarning
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
              <label className="block text-[11px] font-bold text-gray-500 dark:text-ink-muted tracking-wider uppercase mb-1.5">{profDict.behanceLabel}</label>
              <div className="relative flex items-center rounded-xl border border-gray-200 dark:border-hairline bg-white dark:bg-card overflow-hidden focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                <div className="pl-3.5 pr-2 text-gray-400 dark:text-ink-muted">
                  <FaBehance className="w-4 h-4" />
                </div>
                <input
                  suppressHydrationWarning
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
              suppressHydrationWarning
              type="submit"
              disabled={isLoading}
              className="bg-white dark:bg-card border-2 border-brand text-brand hover:bg-brand-light font-bold text-sm px-8 py-2 rounded-full transition disabled:opacity-70"
            >
              {isLoading ? profDict.saving : profDict.saveButton}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}