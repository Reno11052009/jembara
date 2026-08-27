"use client";

import { useEffect, useState } from "react";
import type { RegionLevel, RegionOption } from "@/lib/regions";

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

function placeholder(label: string, loading: boolean) {
  return loading ? `Memuat ${label.toLocaleLowerCase("id-ID")}...` : `Pilih ${label}`;
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
      <div>
        <label htmlFor="provinceCode" className={labelClassName}>Provinsi</label>
        <select
          id="provinceCode"
          name="provinceCode"
          value={provinceCode}
          onChange={(event) => {
            setProvinceCode(event.target.value);
            setRegencyCode("");
            setDistrictCode("");
            setVillageCode("");
          }}
          disabled={provinces.loading}
          className={fieldClassName}
          required
        >
          <option value="">{placeholder("provinsi", provinces.loading)}</option>
          {provinces.options.map((option) => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="regencyCode" className={labelClassName}>Kabupaten/Kota</label>
        <select
          id="regencyCode"
          name="regencyCode"
          value={regencyCode}
          onChange={(event) => {
            setRegencyCode(event.target.value);
            setDistrictCode("");
            setVillageCode("");
          }}
          disabled={!provinceCode || regencies.loading}
          className={fieldClassName}
          required
        >
          <option value="">{placeholder("kabupaten/kota", regencies.loading)}</option>
          {regencies.options.map((option) => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="districtCode" className={labelClassName}>Kecamatan</label>
        <select
          id="districtCode"
          name="districtCode"
          value={districtCode}
          onChange={(event) => {
            setDistrictCode(event.target.value);
            setVillageCode("");
          }}
          disabled={!regencyCode || districts.loading}
          className={fieldClassName}
          required
        >
          <option value="">{placeholder("kecamatan", districts.loading)}</option>
          {districts.options.map((option) => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="villageCode" className={labelClassName}>Kelurahan/Desa</label>
        <select
          id="villageCode"
          name="villageCode"
          value={villageCode}
          onChange={(event) => setVillageCode(event.target.value)}
          disabled={!districtCode || villages.loading}
          className={fieldClassName}
          required
        >
          <option value="">{placeholder("kelurahan/desa", villages.loading)}</option>
          {villages.options.map((option) => (
            <option key={option.code} value={option.code}>{option.name}</option>
          ))}
        </select>
      </div>

      <div className="md:col-span-2">
        <label htmlFor="addressDetail" className={labelClassName}>Detail Alamat</label>
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
