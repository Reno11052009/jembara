import "server-only";

import { z } from "zod";

const WILAYAH_API_BASE_URL = "https://wilayah.id/api";
const REGION_CACHE_SECONDS = 24 * 60 * 60;

export const regionLevels = [
  "provinces",
  "regencies",
  "districts",
  "villages",
] as const;

export type RegionLevel = (typeof regionLevels)[number];
export type RegionOption = { code: string; name: string };

export type RegionSelectionInput = {
  provinceCode: string;
  regencyCode: string;
  districtCode: string;
  villageCode: string;
};

export type ValidatedRegionSelection = RegionSelectionInput & {
  provinceName: string;
  regencyName: string;
  districtName: string;
  villageName: string;
};

const regionResponseSchema = z.object({
  data: z.array(
    z.object({
      code: z.string().min(1).max(20),
      name: z.string().trim().min(1).max(150),
    }),
  ),
});

const parentCodePatterns: Partial<Record<RegionLevel, RegExp>> = {
  regencies: /^\d{2}$/,
  districts: /^\d{2}\.\d{2}$/,
  villages: /^\d{2}\.\d{2}\.\d{2}$/,
};

export class RegionInputError extends Error {}
export class RegionServiceError extends Error {}

function createRegionUrl(level: RegionLevel, parentCode?: string) {
  if (level === "provinces") return `${WILAYAH_API_BASE_URL}/provinces.json`;

  const pattern = parentCodePatterns[level];
  if (!parentCode || !pattern?.test(parentCode)) {
    throw new RegionInputError("Kode induk wilayah tidak valid");
  }

  return `${WILAYAH_API_BASE_URL}/${level}/${parentCode}.json`;
}

export async function getRegionOptions(
  level: RegionLevel,
  parentCode?: string,
): Promise<RegionOption[]> {
  const url = createRegionUrl(level, parentCode);

  let response: Response;
  try {
    response = await fetch(url, {
      headers: { Accept: "application/json" },
      next: { revalidate: REGION_CACHE_SECONDS },
      signal: AbortSignal.timeout(8_000),
    });
  } catch {
    throw new RegionServiceError("Layanan data wilayah sedang tidak dapat diakses");
  }

  if (!response.ok) {
    throw new RegionServiceError("Layanan data wilayah mengembalikan respons gagal");
  }

  const parsed = regionResponseSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new RegionServiceError("Format data wilayah tidak valid");
  }

  return parsed.data.data;
}

function findRegion(options: RegionOption[], code: string, label: string) {
  const region = options.find((option) => option.code === code);
  if (!region) throw new RegionInputError(`${label} tidak valid`);
  return region;
}

export async function validateRegionSelection(
  input: RegionSelectionInput,
): Promise<ValidatedRegionSelection> {
  const provinces = await getRegionOptions("provinces");
  const province = findRegion(provinces, input.provinceCode, "Provinsi");

  const regencies = await getRegionOptions("regencies", province.code);
  const regency = findRegion(regencies, input.regencyCode, "Kabupaten/kota");

  const districts = await getRegionOptions("districts", regency.code);
  const district = findRegion(districts, input.districtCode, "Kecamatan");

  const villages = await getRegionOptions("villages", district.code);
  const village = findRegion(villages, input.villageCode, "Kelurahan/desa");

  return {
    provinceCode: province.code,
    provinceName: province.name,
    regencyCode: regency.code,
    regencyName: regency.name,
    districtCode: district.code,
    districtName: district.name,
    villageCode: village.code,
    villageName: village.name,
  };
}

export function formatRegionLocation(
  region: Pick<ValidatedRegionSelection, "regencyName" | "provinceName">,
) {
  return `${region.regencyName}, ${region.provinceName}`;
}
