"use client";

import { useEffect, useState } from "react";
import type { RegionLevel, RegionOption } from "@/lib/regions";
import SearchableSelect from "@/components/ui/SearchableSelect";

export type RegionFieldValue = {
  addressDetail: string;
  provinceCode: string;
  regencyCode: string;
  districtCode: string;
  villageCode: string;
};

type IndonesiaRegionFieldsProps = {
  initialValue?: Partial<RegionFieldValue>;
};

const fieldClassName =
  "w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none transition focus:border-brand focus:ring-1 focus:ring-brand disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400";
const labelClassName =
  "mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-gray-500";

function useRegionOptions(level: RegionLevel, parentCode?: string) {
  const [options, setOptions] = useState<RegionOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const enabled = level === "provinces" || Boolean(parentCode);

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
      } catch (requestError) {
        if (controller.signal.aborted) return;
        setOptions([]);
        setError(
          requestError instanceof Error
            ? requestError.message
            : "Gagal mengambil data wilayah",
        );
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
}: IndonesiaRegionFieldsProps) {
  const [provinceCode, setProvinceCode] = useState(initialValue.provinceCode || "");
  const [regencyCode, setRegencyCode] = useState(initialValue.regencyCode || "");
  const [districtCode, setDistrictCode] = useState(initialValue.districtCode || "");
  const [villageCode, setVillageCode] = useState(initialValue.villageCode || "");

  const provinces = useRegionOptions("provinces");
  const regencies = useRegionOptions("regencies", provinceCode);
  const districts = useRegionOptions("districts", regencyCode);
  const villages = useRegionOptions("villages", districtCode);
  const regionError =
    provinces.error || regencies.error || districts.error || villages.error;

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
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

      {regionError ? (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700 md:col-span-2">
          {regionError}. Silakan coba lagi.
        </p>
      ) : null}

      <p className="text-xs text-gray-400 md:col-span-2">
        Data wilayah administratif disediakan oleh wilayah.id.
      </p>
    </div>
  );
}