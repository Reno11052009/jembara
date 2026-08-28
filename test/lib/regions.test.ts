import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  getRegionOptions,
  RegionInputError,
  validateRegionSelection,
} from "@/lib/regions";

function apiResponse(data: Array<{ code: string; name: string }>) {
  return new Response(JSON.stringify({ data }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

describe("wilayah.id integration", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uses the official hierarchical endpoints", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(apiResponse([{ code: "35", name: "Jawa Timur" }]))
      .mockResolvedValueOnce(apiResponse([{ code: "35.73", name: "Kota Malang" }]))
      .mockResolvedValueOnce(apiResponse([{ code: "35.73.05", name: "Lowokwaru" }]))
      .mockResolvedValueOnce(apiResponse([{ code: "35.73.05.1001", name: "Dinoyo" }]));
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      validateRegionSelection({
        provinceCode: "35",
        regencyCode: "35.73",
        districtCode: "35.73.05",
        villageCode: "35.73.05.1001",
      }),
    ).resolves.toEqual({
      provinceCode: "35",
      provinceName: "Jawa Timur",
      regencyCode: "35.73",
      regencyName: "Kota Malang",
      districtCode: "35.73.05",
      districtName: "Lowokwaru",
      villageCode: "35.73.05.1001",
      villageName: "Dinoyo",
    });

    expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
      "https://wilayah.id/api/provinces.json",
      "https://wilayah.id/api/regencies/35.json",
      "https://wilayah.id/api/districts/35.73.json",
      "https://wilayah.id/api/villages/35.73.05.json",
    ]);
  });

  it("rejects malformed parent codes before requesting the API", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(getRegionOptions("districts", "malang")).rejects.toBeInstanceOf(
      RegionInputError,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
