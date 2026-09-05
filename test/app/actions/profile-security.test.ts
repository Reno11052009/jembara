import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  verifySession: vi.fn(),
  consumeRateLimit: vi.fn(),
  userFindUnique: vi.fn(),
  businessCategoryFindFirst: vi.fn(),
  transaction: vi.fn(),
  userUpdate: vi.fn(),
  studentUpsert: vi.fn(),
  studentSkillFindMany: vi.fn(),
  studentSkillDeleteMany: vi.fn(),
  studentSkillCreate: vi.fn(),
  studentSkillUpsert: vi.fn(),
  skillFindFirst: vi.fn(),
  umkmUpsert: vi.fn(),
  validateRegionSelection: vi.fn(),
  createUserNotification: vi.fn(),
  revalidatePath: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/lib/education", () => ({
  educationLevelOptions: [
    { value: "SMA", label: "SMA" },
    { value: "S1", label: "S1" },
  ],
  educationUsesSemester: (level: string) => level === "S1",
}));
vi.mock("@/lib/session", () => ({ verifySession: mocks.verifySession }));
vi.mock("@/lib/rate-limit", () => ({
  consumeRateLimit: mocks.consumeRateLimit,
  createRateLimitKey: vi.fn(() => "profile:test"),
}));
vi.mock("@/config/unifiedConfig", () => ({
  config: {
    security: {
      auth: {
        rateLimit: {
          profileUpdateByUser: { limit: 10, windowMs: 600_000 },
        },
      },
    },
  },
}));
vi.mock("@/lib/prisma", () => ({
  default: {
    user: { findUnique: mocks.userFindUnique },
    business_category: { findFirst: mocks.businessCategoryFindFirst },
    $transaction: mocks.transaction,
  },
}));
vi.mock("@/lib/notifications", () => ({
  createUserNotification: mocks.createUserNotification,
}));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidatePath }));
vi.mock("@/lib/regions", () => ({
  RegionInputError: class RegionInputError extends Error {},
  RegionServiceError: class RegionServiceError extends Error {},
  validateRegionSelection: mocks.validateRegionSelection,
  formatRegionLocation: vi.fn(() => "Kota Malang, Jawa Timur"),
}));

import { updateProfileAction } from "@/app/actions/profile";

function profileForm() {
  const formData = new FormData();
  formData.set("name", "Andi Pelajar");
  return formData;
}

describe("profile action security", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mocks.verifySession.mockResolvedValue({
      sessionId: "session-id",
      userId: "11111111-1111-4111-8111-111111111111",
      role: "STUDENT",
      name: "Andi",
    });
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: true,
      remaining: 9,
      retryAfterSeconds: 0,
    });
    mocks.userFindUnique.mockResolvedValue({ role: "STUDENT" });
    mocks.businessCategoryFindFirst.mockResolvedValue({ name: "Kuliner" });
    mocks.studentUpsert.mockResolvedValue({ id: "student-1" });
    mocks.studentSkillFindMany.mockResolvedValue([]);
    mocks.skillFindFirst.mockResolvedValue({ id: "skill-1" });
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
    mocks.transaction.mockImplementation(async (callback) =>
      callback({
        user: { update: mocks.userUpdate },
        student: { upsert: mocks.studentUpsert },
        student_skill: {
          findMany: mocks.studentSkillFindMany,
          deleteMany: mocks.studentSkillDeleteMany,
          create: mocks.studentSkillCreate,
          upsert: mocks.studentSkillUpsert,
        },
        skill: { findFirst: mocks.skillFindFirst },
        umkm: { upsert: mocks.umkmUpsert },
      }),
    );
  });

  it("rejects more than twenty skills before opening a transaction", async () => {
    const formData = profileForm();
    formData.set(
      "skills",
      Array.from({ length: 21 }, (_, index) => `Skill ${index + 1}`).join(","),
    );

    await expect(updateProfileAction(formData)).resolves.toEqual({
      error: "Maksimal 20 skill dapat ditambahkan",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects spoofed image data before a database transaction", async () => {
    const formData = profileForm();
    formData.set(
      "avatarBase64",
      `data:image/webp;base64,${Buffer.from("not-a-webp").toString("base64")}`,
    );

    const result = await updateProfileAction(formData);
    expect(result).toEqual({
      error: "Foto profil maksimal 256 KB dan harus PNG, JPEG, atau WebP",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rate limits authenticated profile updates", async () => {
    mocks.consumeRateLimit.mockResolvedValue({
      allowed: false,
      remaining: 0,
      retryAfterSeconds: 30,
    });

    await expect(updateProfileAction(profileForm())).resolves.toEqual({
      error: "Terlalu banyak pembaruan profil. Silakan coba lagi nanti.",
    });
    expect(mocks.userFindUnique).not.toHaveBeenCalled();
  });

  it("rejects a new skill outside the official taxonomy", async () => {
    const formData = profileForm();
    formData.set("skills", "Skill Buatan Penyerang");

    await expect(updateProfileAction(formData)).resolves.toEqual({
      error: "Skill baru harus dipilih dari daftar resmi Jembara.",
    });
    expect(mocks.studentSkillDeleteMany).not.toHaveBeenCalled();
  });

  it("uses an existing canonical skill without creating master data", async () => {
    const formData = profileForm();
    formData.set("skills", "web development");

    await expect(updateProfileAction(formData)).resolves.toEqual({ success: true });
    expect(mocks.skillFindFirst).toHaveBeenCalledWith({
      where: { name: { equals: "Web Development", mode: "insensitive" } },
      select: { id: true },
    });
    expect(mocks.studentSkillUpsert).toHaveBeenCalledWith({
      where: { studentId_skillId: { studentId: "student-1", skillId: "skill-1" } },
      update: { level: "BEGINNER" },
      create: { studentId: "student-1", skillId: "skill-1", level: "BEGINNER" },
      select: { id: true },
    });
  });

  it("publishes a student profile only after explicit opt-in", async () => {
    const formData = profileForm();
    formData.set("publicProfileSubmitted", "1");
    formData.set("isPublicProfile", "on");

    await expect(updateProfileAction(formData)).resolves.toEqual({ success: true });

    expect(mocks.studentUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ isPublicProfile: true }),
      }),
    );
  });

  it("stores whether a student is available for matching", async () => {
    const formData = profileForm();
    formData.set("availabilitySubmitted", "1");
    formData.set("available", "on");

    await expect(updateProfileAction(formData)).resolves.toEqual({ success: true });

    expect(mocks.studentUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ available: true }),
      }),
    );
  });

  it("stores a verified structured address for a student", async () => {
    const formData = profileForm();
    formData.set("addressDetail", "Jalan Veteran 8, RT 02/RW 03");
    formData.set("provinceCode", "35");
    formData.set("regencyCode", "35.73");
    formData.set("districtCode", "35.73.05");
    formData.set("villageCode", "35.73.05.1001");

    await expect(updateProfileAction(formData)).resolves.toEqual({ success: true });

    expect(mocks.validateRegionSelection).toHaveBeenCalledWith({
      provinceCode: "35",
      regencyCode: "35.73",
      districtCode: "35.73.05",
      villageCode: "35.73.05.1001",
    });
    expect(mocks.userUpdate).toHaveBeenCalledWith({
      where: { id: "11111111-1111-4111-8111-111111111111" },
      data: expect.objectContaining({ location: "Kota Malang, Jawa Timur" }),
    });
    expect(mocks.studentUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          alamat_detail: "Jalan Veteran 8, RT 02/RW 03",
          provinsi_kode: "35",
          provinsi_nama: "Jawa Timur",
          kabupaten_kode: "35.73",
          kabupaten_nama: "Kota Malang",
          kecamatan_kode: "35.73.05",
          kecamatan_nama: "Lowokwaru",
          kelurahan_kode: "35.73.05.1001",
          kelurahan_nama: "Dinoyo",
        }),
      }),
    );
    expect(mocks.umkmUpsert).not.toHaveBeenCalled();
  });

  it("stores a complete manual address when the region is missing from the API", async () => {
    const formData = profileForm();
    formData.set("regionMode", "manual");
    formData.set("addressDetail", "Jalan Perbatasan Nomor 12");
    formData.set("provinceName", "Provinsi Contoh");
    formData.set("regencyName", "Kabupaten Contoh");
    formData.set("districtName", "Kecamatan Contoh");
    formData.set("villageName", "Desa Contoh");

    await expect(updateProfileAction(formData)).resolves.toEqual({ success: true });

    expect(mocks.validateRegionSelection).not.toHaveBeenCalled();
    expect(mocks.studentUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({
          alamat_detail: "Jalan Perbatasan Nomor 12",
          provinsi_kode: null,
          provinsi_nama: "Provinsi Contoh",
          kabupaten_kode: null,
          kabupaten_nama: "Kabupaten Contoh",
          kecamatan_kode: null,
          kecamatan_nama: "Kecamatan Contoh",
          kelurahan_kode: null,
          kelurahan_nama: "Desa Contoh",
        }),
      }),
    );
  });

  it("rejects an incomplete manual address before opening a transaction", async () => {
    const formData = profileForm();
    formData.set("regionMode", "manual");
    formData.set("addressDetail", "Jalan Perbatasan Nomor 12");
    formData.set("provinceName", "Provinsi Contoh");

    await expect(updateProfileAction(formData)).resolves.toEqual({
      error: "Nama wilayah manual wajib dilengkapi",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("updates UMKM business information instead of education data", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "UMKM" });
    const formData = profileForm();
    formData.set("businessName", "Kopi Jembara");
    formData.set("businessCategory", "Kuliner");
    formData.set("businessWebsite", "kopijembara.id");
    formData.set("addressDetail", "Jalan Merdeka 10");
    formData.set("provinceCode", "35");
    formData.set("regencyCode", "35.73");
    formData.set("districtCode", "35.73.05");
    formData.set("villageCode", "35.73.05.1001");

    await expect(updateProfileAction(formData)).resolves.toEqual({ success: true });

    expect(mocks.umkmUpsert).toHaveBeenCalledWith({
      where: { userId: "11111111-1111-4111-8111-111111111111" },
      update: {
        nama_usaha: "Kopi Jembara",
        kategori_usaha: "Kuliner",
        website: "https://kopijembara.id/",
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
        userId: "11111111-1111-4111-8111-111111111111",
        nama_usaha: "Kopi Jembara",
        kategori_usaha: "Kuliner",
        website: "https://kopijembara.id/",
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
    expect(mocks.studentUpsert).not.toHaveBeenCalled();
  });

  it("requires a business name and category for UMKM profiles", async () => {
    mocks.userFindUnique.mockResolvedValue({ role: "UMKM" });

    await expect(updateProfileAction(profileForm())).resolves.toEqual({
      error: "Nama usaha wajib diisi",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("rejects a UMKM category that is not active in master data", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      umkm: { kategori_usaha: "Kuliner" },
    });
    mocks.businessCategoryFindFirst.mockResolvedValue(null);
    const formData = profileForm();
    formData.set("businessName", "Kopi Jembara");
    formData.set("businessCategory", "Kategori Buatan");

    await expect(updateProfileAction(formData)).resolves.toEqual({
      error: "Kategori usaha tidak tersedia. Silakan pilih dari daftar.",
    });
    expect(mocks.transaction).not.toHaveBeenCalled();
  });

  it("keeps an unchanged legacy UMKM category", async () => {
    mocks.userFindUnique.mockResolvedValue({
      role: "UMKM",
      umkm: { kategori_usaha: "Kategori Lama" },
    });
    mocks.businessCategoryFindFirst.mockResolvedValue(null);
    const formData = profileForm();
    formData.set("businessName", "Usaha Warisan");
    formData.set("businessCategory", "Kategori Lama");
    formData.set("regionMode", "manual");
    formData.set("addressDetail", "Jalan Lama Nomor 12");
    formData.set("provinceName", "Jawa Timur");
    formData.set("regencyName", "Kota Malang");
    formData.set("districtName", "Lowokwaru");
    formData.set("villageName", "Dinoyo");

    await expect(updateProfileAction(formData)).resolves.toEqual({ success: true });
    expect(mocks.umkmUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        update: expect.objectContaining({ kategori_usaha: "Kategori Lama" }),
      }),
    );
  });
});
