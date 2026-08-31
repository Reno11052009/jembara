"use client";

import { useEffect, useState } from "react";
import type { RegionLevel, RegionOption } from "@/lib/regions";
import SearchableSelect from "@/components/ui/SearchableSelect";

export type RegionFieldValue = {
<<<<<<< HEAD
  addressDetail?: string;
  provinceCode?: string;
  provinceName?: string;
  regencyCode?: string;
  regencyName?: string;
  districtCode?: string;
  districtName?: string;
  villageCode?: string;
  villageName?: string;
=======
  addressDetail: string;
  provinceCode: string;
  provinceName: string;
  regencyCode: string;
  regencyName: string;
  districtCode: string;
  districtName: string;
  villageCode: string;
  villageName: string;
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
};

type IndonesiaRegionFieldsProps = {
  initialValue?: Partial<RegionFieldValue>;
  allowManualFallback?: boolean;
};

const fieldClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";
const labelClassName =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500";

<<<<<<< HEAD
function useRegionOptions(level: RegionLevel, parentCode?: string) {
  const [options, setOptions] = useState<RegionOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const enabled = level === "provinces" || Boolean(parentCode);
=======
function useRegionOptions(
  level: RegionLevel,
  parentCode?: string,
  active = true,
) {
  const [options, setOptions] = useState<RegionOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const enabled = active && (level === "provinces" || Boolean(parentCode));
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63

  useEffect(() => {
    if (!enabled) return;

    const controller = new AbortController();
    const params = new URLSearchParams({ level });
    if (parentCode) params.set("parentCode", parentCode);

    async function loadOptions() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(`/api/wilayah?${params.toString()}`, {
          signal: controller.signal,
        });
        const payload = (await response.json()) as {
          data?: RegionOption[];
          error?: string;
        };
        if (!response.ok || !payload.data) {
          throw new Error(payload.error || "Gagal mengambil data wilayah");
        }
        setOptions(payload.data);
<<<<<<< HEAD
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setOptions([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Gagal mengambil data wilayah",
        );
=======
      } catch {
        if (controller.signal.aborted) return;
        setOptions([]);
        setError("Gagal mengambil data wilayah");
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    void loadOptions();
    return () => controller.abort();
  }, [enabled, level, parentCode]);

  return { options, loading, error };
}

export default function IndonesiaRegionFields({
  initialValue = {},
<<<<<<< HEAD
}: IndonesiaRegionFieldsProps) {
=======
  allowManualFallback = false,
}: IndonesiaRegionFieldsProps) {
  const hasCompleteInitialCodes = Boolean(
    initialValue.provinceCode &&
      initialValue.regencyCode &&
      initialValue.districtCode &&
      initialValue.villageCode,
  );
  const hasInitialRegionNames = Boolean(
    initialValue.provinceName ||
      initialValue.regencyName ||
      initialValue.districtName ||
      initialValue.villageName,
  );
  const [isManualMode, setIsManualMode] = useState(
    allowManualFallback && hasInitialRegionNames && !hasCompleteInitialCodes,
  );
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
  const [provinceCode, setProvinceCode] = useState(initialValue.provinceCode || "");
  const [regencyCode, setRegencyCode] = useState(initialValue.regencyCode || "");
  const [districtCode, setDistrictCode] = useState(initialValue.districtCode || "");
  const [villageCode, setVillageCode] = useState(initialValue.villageCode || "");

<<<<<<< HEAD
  const provinces = useRegionOptions("provinces");
  const regencies = useRegionOptions("regencies", provinceCode);
  const districts = useRegionOptions("districts", regencyCode);
  const villages = useRegionOptions("villages", districtCode);
=======
  const useApiOptions = !isManualMode;
  const provinces = useRegionOptions("provinces", undefined, useApiOptions);
  const regencies = useRegionOptions("regencies", provinceCode, useApiOptions);
  const districts = useRegionOptions("districts", regencyCode, useApiOptions);
  const villages = useRegionOptions("villages", districtCode, useApiOptions);
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
  const regionError =
    provinces.error || regencies.error || districts.error || villages.error;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
<<<<<<< HEAD
      <SearchableSelect
        id="provinceCode"
        name="provinceCode"
        label="Provinsi"
        value={provinceCode}
        onChange={(code) => {
          setProvinceCode(code);
          setRegencyCode("");
          setDistrictCode("");
          setVillageCode("");
        }}
        options={provinces.options}
        loading={provinces.loading}
        placeholder="Pilih Provinsi"
        searchPlaceholder="Pilih provinsi..."
        required
      />

      <SearchableSelect
        id="regencyCode"
        name="regencyCode"
        label="Kabupaten/Kota"
        value={regencyCode}
        onChange={(code) => {
          setRegencyCode(code);
          setDistrictCode("");
          setVillageCode("");
        }}
        options={regencies.options}
        loading={regencies.loading}
        disabled={!provinceCode}
        placeholder="Pilih kota"
        searchPlaceholder="Pilih kota..."
        required
      />

      <SearchableSelect
        id="districtCode"
        name="districtCode"
        label="Kecamatan"
        value={districtCode}
        onChange={(code) => {
          setDistrictCode(code);
          setVillageCode("");
        }}
        options={districts.options}
        loading={districts.loading}
        disabled={!regencyCode}
        placeholder="Pilih kecamatan"
        searchPlaceholder="Pilih kecamatan..."
        required
      />

      <SearchableSelect
        id="villageCode"
        name="villageCode"
        label="Kelurahan/Desa"
        value={villageCode}
        onChange={setVillageCode}
        options={villages.options}
        loading={villages.loading}
        disabled={!districtCode}
        placeholder="Pilih desa"
        searchPlaceholder="Pilih desa..."
        required
      />
=======
      <input
        type="hidden"
        name="regionMode"
        value={isManualMode ? "manual" : "api"}
      />

      {isManualMode ? (
        <>
          <div>
            <label htmlFor="provinceName" className={labelClassName}>
              Provinsi <span className="text-red-500">*</span>
            </label>
            <input
              id="provinceName"
              name="provinceName"
              type="text"
              defaultValue={initialValue.provinceName || ""}
              minLength={2}
              maxLength={150}
              placeholder="Tulis nama provinsi"
              className={fieldClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="regencyName" className={labelClassName}>
              Kabupaten/Kota <span className="text-red-500">*</span>
            </label>
            <input
              id="regencyName"
              name="regencyName"
              type="text"
              defaultValue={initialValue.regencyName || ""}
              minLength={2}
              maxLength={150}
              placeholder="Tulis nama kabupaten/kota"
              className={fieldClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="districtName" className={labelClassName}>
              Kecamatan <span className="text-red-500">*</span>
            </label>
            <input
              id="districtName"
              name="districtName"
              type="text"
              defaultValue={initialValue.districtName || ""}
              minLength={2}
              maxLength={150}
              placeholder="Tulis nama kecamatan"
              className={fieldClassName}
              required
            />
          </div>
          <div>
            <label htmlFor="villageName" className={labelClassName}>
              Kelurahan/Desa <span className="text-red-500">*</span>
            </label>
            <input
              id="villageName"
              name="villageName"
              type="text"
              defaultValue={initialValue.villageName || ""}
              minLength={2}
              maxLength={150}
              placeholder="Tulis nama kelurahan/desa"
              className={fieldClassName}
              required
            />
          </div>
        </>
      ) : (
        <>
          <SearchableSelect
            id="provinceCode"
            name="provinceCode"
            label="Provinsi"
            value={provinceCode}
            onChange={(code) => {
              setProvinceCode(code);
              setRegencyCode("");
              setDistrictCode("");
              setVillageCode("");
            }}
            options={provinces.options}
            loading={provinces.loading}
            placeholder="Pilih provinsi"
            searchPlaceholder="Cari provinsi..."
            required
          />

          <SearchableSelect
            id="regencyCode"
            name="regencyCode"
            label="Kabupaten/Kota"
            value={regencyCode}
            onChange={(code) => {
              setRegencyCode(code);
              setDistrictCode("");
              setVillageCode("");
            }}
            options={regencies.options}
            loading={regencies.loading}
            disabled={!provinceCode}
            placeholder="Pilih kabupaten/kota"
            searchPlaceholder="Cari kabupaten/kota..."
            required
          />

          <SearchableSelect
            id="districtCode"
            name="districtCode"
            label="Kecamatan"
            value={districtCode}
            onChange={(code) => {
              setDistrictCode(code);
              setVillageCode("");
            }}
            options={districts.options}
            loading={districts.loading}
            disabled={!regencyCode}
            placeholder="Pilih kecamatan"
            searchPlaceholder="Cari kecamatan..."
            required
          />

          <SearchableSelect
            id="villageCode"
            name="villageCode"
            label="Kelurahan/Desa"
            value={villageCode}
            onChange={setVillageCode}
            options={villages.options}
            loading={villages.loading}
            disabled={!districtCode}
            placeholder="Pilih kelurahan/desa"
            searchPlaceholder="Cari kelurahan/desa..."
            required
          />
        </>
      )}

      {allowManualFallback ? (
        <div className="md:col-span-2">
          <button
            type="button"
            onClick={() => setIsManualMode((current) => !current)}
            className="text-sm font-semibold text-brand transition hover:text-brand-dark hover:underline"
          >
            {isManualMode
              ? "Kembali pilih dari daftar wilayah"
              : "Wilayah tidak ada di daftar? Isi secara manual"}
          </button>
          {isManualMode ? (
            <p className="mt-1 text-xs text-gray-400">
              Nama wilayah manual akan disimpan tanpa kode wilayah.id.
            </p>
          ) : null}
        </div>
      ) : null}
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63

      <div className="md:col-span-2">
        <label htmlFor="addressDetail" className={labelClassName}>
          Detail Alamat <span className="text-red-500">*</span>
        </label>
        <textarea
          id="addressDetail"
          name="addressDetail"
          defaultValue={initialValue.addressDetail || ""}
          rows={3}
          minLength={5}
          maxLength={255}
          autoComplete="street-address"
          placeholder="Nama jalan, nomor bangunan, RT/RW, atau patokan"
          className={`${fieldClassName} resize-none`}
          required
        />
      </div>

<<<<<<< HEAD
      {regionError ? (
=======
      {!isManualMode && regionError ? (
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:col-span-2">
          {regionError}. Silakan coba lagi.
        </p>
      ) : null}

      <p className="text-xs text-gray-400 md:col-span-2">
        Data wilayah administratif disediakan oleh wilayah.id.
      </p>
    </div>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> f5cdc7e448e6859d969a242a1ccacee35caadf63
