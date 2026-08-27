import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  createSession: vi.fn(),
  deleteSession: vi.fn(),
  redirect: vi.fn(),
  userFindUnique: vi.fn(),
  userUpdate: vi.fn(),
  studentUpsert: vi.fn(),
  umkmUpsert: vi.fn(),
  transaction: vi.fn(),
  validateRegionSelection: vi.fn(),
}));

const transactionClient = {
  user: {
    findUnique: mocks.userFindUnique,
    update: mocks.userUpdate,
  },
  student: { upsert: mocks.studentUpsert },
  umkm: { upsert: mocks.umkmUpsert },
};

vi.mock("server-only", () => ({}));
vi.mock("@/lib/prisma", () => ({
  default: {
    $transaction: mocks.transaction,
    user: { findFirst: vi.fn(), create: vi.fn() },
  },
}));
vi.mock("bcryptjs", () => ({
  default: { compare: vi.fn(), hash: vi.fn() },
}));
vi.mock("@/lib/session", () => ({
  verifySession: mocks.verifySession,
  createSession: mocks.createSession,
  deleteSession: mocks.deleteSession,
}));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: vi.fn(),
  clearRateLimit: vi.fn(),
  getClientAddress: vi.fn(),
  createRateLimitKey: vi.fn(),
}));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("@/lib/regions", () => ({
  RegionInputError: class RegionInputError extends Error {},
  RegionServiceError: class RegionServiceError extends Error {},
  validateRegionSelection: mocks.validateRegionSelection,
  formatRegionLocation: vi.fn(() => "Kota Malang, Jawa Timur"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          loginByIp: { limit: 30, windowMs: 900_000 },
          loginByIpAndIdentity: { limit: 5, windowMs: 900_000 },
          registerByIp: { limit: 5, windowMs: 3_600_000 },
        },
      },
    },
  },
}));

import { selectRoleAction } from "./auth";

describe("UMKM role onboarding", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      userId: "user-1",
      role: "STUDENT",
      name: "Rina",
    });
    mocks.userFindUnique.mockResolvedValue({
      id: "user-1",
      name: "Rina",
      role: "STUDENT",
      student: null,
      umkm: null,
    });
    mocks.transaction.mockImplementation(async (callback) =>
      callback(transactionClient),
    );
    mocks.validateRegionSelection.mockResolvedValue({
      provinceCode: "35",
      provinceName: "Jawa Timur",
      regencyCode: "35.73",
      regencyName: "Kota Malang",
      districtCode: "35.73.05",
      districtName: "Lowokwaru",
      villageCode: "35.73.05.1001",
      villageName: "Dinoyo",
    });
  });

  it("stores the business profile together with the selected role", async () => {
    const formData = new FormData();
    formData.set("role", "UMKM");
    formData.set("businessName", "Kopi Jembara");
    formData.set("businessCategory", "Kuliner");
    formData.set("addressDetail", "Jalan Merdeka 10");
    formData.set("provinceCode", "35");
    formData.set("regencyCode", "35.73");
    formData.set("districtCode", "35.73.05");
    formData.set("villageCode", "35.73.05.1001");
    formData.set("phone", "+62 812-3456-7890");
    formData.set("website", "kopijembara.id");

    await selectRoleAction({}, formData);

    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: {
        role: "UMKM",
        location: "Kota Malang, Jawa Timur",
        no_telepon: "+62 812-3456-7890",
      },
    });
    expect(mocks.umkmUpsert).toHaveBeenCalledWith({
      where: { userId: "user-1" },
      update: {
        nama_usaha: "Kopi Jembara",
        kategori_usaha: "Kuliner",
        website: "https://kopijembara.id",
        alamat_detail: "Jalan Merdeka 10",
        provinsi_kode: "35",
        provinsi_nama: "Jawa Timur",
        kabupaten_kode: "35.73",
        kabupaten_nama: "Kota Malang",
        kecamatan_kode: "35.73.05",
        kecamatan_nama: "Lowokwaru",
        kelurahan_kode: "35.73.05.1001",
        kelurahan_nama: "Dinoyo",
      },
      create: {
        userId: "user-1",
        nama_usaha: "Kopi Jembara",
        kategori_usaha: "Kuliner",
        website: "https://kopijembara.id",
        alamat_detail: "Jalan Merdeka 10",
        provinsi_kode: "35",
        provinsi_nama: "Jawa Timur",
        kabupaten_kode: "35.73",
        kabupaten_nama: "Kota Malang",
        kecamatan_kode: "35.73.05",
        kecamatan_nama: "Lowokwaru",
        kelurahan_kode: "35.73.05.1001",
        kelurahan_nama: "Dinoyo",
      },
    });
    expect(mocks.createSession).toHaveBeenCalledWith(
      "user-1",
      "UMKM",
      "Rina",
    );
    expect(mocks.redirect).toHaveBeenLastCalledWith("/dashboard");
  });

  it("does not write incomplete UMKM data", async () => {
    const formData = new FormData();
    formData.set("role", "UMKM");

    await expect(selectRoleAction({}, formData)).resolves.toEqual({
      error: "Nama usaha wajib diisi",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });
});
