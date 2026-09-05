"use server";

import { Buffer } from "node:buffer";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { verifySession } from "@/lib/session";
import { createUserNotification } from "@/lib/notifications";
import { educationLevelOptions, educationUsesSemester } from "@/lib/education";
import { config } from "@/config/unifiedConfig";
import { consumeRateLimit, createRateLimitKey } from "@/lib/rate-limit";
import { getCanonicalSkillName } from "@/lib/skill-taxonomy";
import {
  formatRegionLocation,
  RegionInputError,
  RegionServiceError,
  validateRegionSelection,
  type ValidatedRegionSelection,
} from "@/lib/regions";

const MAX_SKILLS = 20;
const MAX_AVATAR_BYTES = 256 * 1024;
const educationLevels = new Set<string>(
  educationLevelOptions.map(({ value }) => value),
);

const optionalText = (maximum: number) =>
  z.string().trim().max(maximum).optional();

const manualRegionName = (label: string) =>
  z
    .string()
    .trim()
    .min(2, `${label} minimal 2 karakter`)
    .max(150, `${label} terlalu panjang`)
    .optional();

const profileSchema = z.object({
  name: z.string().trim().min(3, "Nama minimal 3 karakter").max(100),
  headline: optionalText(100),
  businessName: z
    .string()
    .trim()
    .min(3, "Nama usaha minimal 3 karakter")
    .max(120, "Nama usaha terlalu panjang")
    .optional(),
  businessCategory: z
    .string()
    .trim()
    .min(2, "Kategori usaha minimal 2 karakter")
    .max(100, "Kategori usaha terlalu panjang")
    .optional(),
  businessWebsite: optionalText(2048),
  addressDetail: z
    .string()
    .trim()
    .min(5, "Detail alamat minimal 5 karakter")
    .max(255, "Detail alamat terlalu panjang")
    .optional(),
  provinceCode: z.string().regex(/^\d{2}$/, "Provinsi tidak valid").optional(),
  regencyCode: z
    .string()
    .regex(/^\d{2}\.\d{2}$/, "Kabupaten/kota tidak valid")
    .optional(),
  districtCode: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{2}$/, "Kecamatan tidak valid")
    .optional(),
  villageCode: z
    .string()
    .regex(/^\d{2}\.\d{2}\.\d{2}\.\d{4}$/, "Kelurahan/desa tidak valid")
    .optional(),
  regionMode: z.enum(["api", "manual"]).optional(),
  provinceName: manualRegionName("Nama provinsi"),
  regencyName: manualRegionName("Nama kabupaten/kota"),
  districtName: manualRegionName("Nama kecamatan"),
  villageName: manualRegionName("Nama kelurahan/desa"),
  location: optionalText(255),
  tingkat_pendidikan: optionalText(10).refine(
    (value) => value === undefined || value === "" || educationLevels.has(value),
    "Jenjang pendidikan tidak valid",
  ),
  school: optionalText(150),
  semester: optionalText(2),
  about: optionalText(2000),
  phone: optionalText(30).refine(
    (value) => value === undefined || /^[+\d\s().-]*$/.test(value),
    "Nomor telepon tidak valid",
  ),
  portfolioUrl: optionalText(2048),
  github: optionalText(2048),
  linkedin: optionalText(2048),
  behance: optionalText(2048),
  skills: optionalText(1200),
  skillLevels: optionalText(4000),
  expectedBudgetMin: optionalText(20),
  expectedBudgetMax: optionalText(20),
  avatarBase64: optionalText(360_000),
  publicProfileSubmitted: z.literal("1").optional(),
  isPublicProfile: z.literal("on").optional(),
  availabilitySubmitted: z.literal("1").optional(),
  available: z.literal("on").optional(),
});

const skillNameSchema = z
  .string()
  .trim()
  .min(2)
  .max(50)
  .regex(
    /^[\p{L}\p{N}][\p{L}\p{N} +#./&()_-]*$/u,
    "Nama skill mengandung karakter yang tidak diizinkan",
  );

class ProfileInputError extends Error {}

function formEntry(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === null ? undefined : value;
}

function parseSkills(value: string | undefined) {
  if (value === undefined) return undefined;

  const uniqueSkills = new Map<string, string>();
  for (const rawSkill of value.split(",")) {
    const normalizedWhitespace = rawSkill.trim().replace(/\s+/g, " ");
    if (!normalizedWhitespace) continue;
    const parsedSkill = skillNameSchema.safeParse(normalizedWhitespace);
    if (!parsedSkill.success) {
      return { error: parsedSkill.error.issues[0]?.message || "Skill tidak valid" };
    }
    const canonicalName = getCanonicalSkillName(parsedSkill.data);
    uniqueSkills.set(
      parsedSkill.data.toLocaleLowerCase("id-ID"),
      canonicalName ?? parsedSkill.data,
    );
  }

  const skills = [...uniqueSkills.values()];
  if (skills.length > MAX_SKILLS) {
    return { error: `Maksimal ${MAX_SKILLS} skill dapat ditambahkan` };
  }
  return { skills };
}

function hasExpectedImageSignature(mimeType: string, bytes: Buffer) {
  if (mimeType === "image/png") {
    return bytes.subarray(0, 8).equals(
      Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    );
  }
  if (mimeType === "image/jpeg") {
    return bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
  }
  if (mimeType === "image/webp") {
    return (
      bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
      bytes.subarray(8, 12).toString("ascii") === "WEBP"
    );
  }
  return false;
}

function validateAvatar(value: string | undefined) {
  if (!value) return { avatar: undefined as string | undefined };
  const match = /^data:(image\/(?:png|jpeg|webp));base64,([A-Za-z0-9+/]+={0,2})$/.exec(
    value,
  );
  if (!match || match[2].length % 4 !== 0) {
    return { error: "Format foto profil tidak valid" };
  }

  const bytes = Buffer.from(match[2], "base64");
  if (
    bytes.length === 0 ||
    bytes.length > MAX_AVATAR_BYTES ||
    !hasExpectedImageSignature(match[1], bytes)
  ) {
    return { error: "Foto profil maksimal 256 KB dan harus PNG, JPEG, atau WebP" };
  }
  return { avatar: value };
}

function normalizeOptionalUrl(value: string | undefined, allowedHosts?: Set<string>) {
  if (value === undefined) return { value: undefined as string | null | undefined };
  if (!value) return { value: null as string | null | undefined };

  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  try {
    const url = new URL(candidate);
    if (!["http:", "https:"].includes(url.protocol)) throw new Error();
    const host = url.hostname.toLocaleLowerCase("en-US");
    if (allowedHosts && !allowedHosts.has(host)) throw new Error();
    return { value: url.toString() as string | null | undefined };
  } catch {
    return { error: "Tautan profil tidak valid" };
  }
}

export async function updateProfileAction(formData: FormData) {
  const session = await verifySession();
  if (!session?.userId || session.userId === "mock-user-id") {
    return { error: "Sesi tidak valid. Silakan login kembali." };
  }

  const parsed = profileSchema.safeParse({
    name: formEntry(formData, "name"),
    headline: formEntry(formData, "headline"),
    businessName: formEntry(formData, "businessName"),
    businessCategory: formEntry(formData, "businessCategory"),
    businessWebsite: formEntry(formData, "businessWebsite"),
    addressDetail: formEntry(formData, "addressDetail"),
    provinceCode: formEntry(formData, "provinceCode"),
    regencyCode: formEntry(formData, "regencyCode"),
    districtCode: formEntry(formData, "districtCode"),
    villageCode: formEntry(formData, "villageCode"),
    regionMode: formEntry(formData, "regionMode"),
    provinceName: formEntry(formData, "provinceName"),
    regencyName: formEntry(formData, "regencyName"),
    districtName: formEntry(formData, "districtName"),
    villageName: formEntry(formData, "villageName"),
    location: formEntry(formData, "location"),
    tingkat_pendidikan: formEntry(formData, "tingkat_pendidikan"),
    school: formEntry(formData, "school"),
    semester: formEntry(formData, "semester"),
    about: formEntry(formData, "about"),
    phone: formEntry(formData, "phone"),
    portfolioUrl: formEntry(formData, "portfolioUrl"),
    github: formEntry(formData, "github"),
    linkedin: formEntry(formData, "linkedin"),
    behance: formEntry(formData, "behance"),
    skills: formEntry(formData, "skills"),
    skillLevels: formEntry(formData, "skillLevels"),
    expectedBudgetMin: formEntry(formData, "expectedBudgetMin"),
    expectedBudgetMax: formEntry(formData, "expectedBudgetMax"),
    avatarBase64: formEntry(formData, "avatarBase64"),
    publicProfileSubmitted: formEntry(formData, "publicProfileSubmitted"),
    isPublicProfile: formEntry(formData, "isPublicProfile"),
    availabilitySubmitted: formEntry(formData, "availabilitySubmitted"),
    available: formEntry(formData, "available"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message || "Data profil tidak valid" };
  }

  const rateLimit = await consumeRateLimit({
    key: createRateLimitKey("profile:update:user", session.userId),
    ...config.security.auth.rateLimit.profileUpdateByUser,
  });
  if (!rateLimit.allowed) {
    return { error: "Terlalu banyak pembaruan profil. Silakan coba lagi nanti." };
  }

  const authenticatedUser = await prisma.user.findUnique({
    where: { id: session.userId },
    select: {
      role: true,
      umkm: { select: { kategori_usaha: true } },
    },
  });
  if (!authenticatedUser || !["STUDENT", "UMKM"].includes(authenticatedUser.role)) {
    return { error: "Akun tidak diizinkan memperbarui profil ini." };
  }
  type ProfileRegionSelection = Omit<
    ValidatedRegionSelection,
    "provinceCode" | "regencyCode" | "districtCode" | "villageCode"
  > & {
    provinceCode: string | null;
    regencyCode: string | null;
    districtCode: string | null;
    villageCode: string | null;
  };
  let validatedRegion: ProfileRegionSelection | null = null;
  let validatedBusinessCategory: string | null = null;
  if (authenticatedUser.role === "UMKM") {
    if (!parsed.data.businessName) return { error: "Nama usaha wajib diisi" };
    if (!parsed.data.businessCategory) return { error: "Kategori usaha wajib diisi" };

    const businessCategory = await prisma.business_category.findFirst({
      where: {
        name: { equals: parsed.data.businessCategory, mode: "insensitive" },
        isActive: true,
      },
      select: { name: true },
    });
    const currentCategory = authenticatedUser.umkm?.kategori_usaha?.trim();
    const isUnchangedLegacyCategory =
      currentCategory?.localeCompare(parsed.data.businessCategory, "id-ID", {
        sensitivity: "accent",
      }) === 0;

    if (!businessCategory && !isUnchangedLegacyCategory) {
      return { error: "Kategori usaha tidak tersedia. Silakan pilih dari daftar." };
    }
    validatedBusinessCategory = businessCategory?.name ?? currentCategory ?? null;
  }

  const hasRegionInput = Boolean(
    parsed.data.addressDetail ||
      parsed.data.provinceCode ||
      parsed.data.regencyCode ||
      parsed.data.districtCode ||
      parsed.data.villageCode ||
      parsed.data.regionMode === "manual" ||
      parsed.data.provinceName ||
      parsed.data.regencyName ||
      parsed.data.districtName ||
      parsed.data.villageName,
  );
  if (authenticatedUser.role === "UMKM" || hasRegionInput) {
    if (!parsed.data.addressDetail) return { error: "Detail alamat wajib diisi" };
    if (parsed.data.regionMode === "manual") {
      if (
        !parsed.data.provinceName ||
        !parsed.data.regencyName ||
        !parsed.data.districtName ||
        !parsed.data.villageName
      ) {
        return { error: "Nama wilayah manual wajib dilengkapi" };
      }

      validatedRegion = {
        provinceCode: null,
        provinceName: parsed.data.provinceName,
        regencyCode: null,
        regencyName: parsed.data.regencyName,
        districtCode: null,
        districtName: parsed.data.districtName,
        villageCode: null,
        villageName: parsed.data.villageName,
      };
    } else {
      if (
        !parsed.data.provinceCode ||
        !parsed.data.regencyCode ||
        !parsed.data.districtCode ||
        !parsed.data.villageCode
      ) {
        return { error: "Wilayah wajib dilengkapi" };
      }

      try {
        validatedRegion = await validateRegionSelection({
          provinceCode: parsed.data.provinceCode,
          regencyCode: parsed.data.regencyCode,
          districtCode: parsed.data.districtCode,
          villageCode: parsed.data.villageCode,
        });
      } catch (error) {
        if (error instanceof RegionInputError) return { error: error.message };
        if (error instanceof RegionServiceError) {
          return { error: "Data wilayah belum dapat diverifikasi. Silakan coba lagi." };
        }
        throw error;
      }
    }
  }

  const parsedSkills = parseSkills(parsed.data.skills);
  if (parsedSkills?.error) return { error: parsedSkills.error };
  const skillLevels: Record<string, "BEGINNER" | "INTERMEDIATE" | "ADVANCED"> = {};
  if (parsed.data.skillLevels) {
    try {
      const raw = JSON.parse(parsed.data.skillLevels) as unknown;
      if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error();
      for (const [name, level] of Object.entries(raw)) {
        if (!["BEGINNER", "INTERMEDIATE", "ADVANCED"].includes(String(level))) throw new Error();
        skillLevels[name.toLocaleLowerCase("id-ID")] = level as "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
      }
    } catch {
      return { error: "Level skill tidak valid" };
    }
  }
  const parseBudget = (value: string | undefined) => value === undefined ? undefined : value === "" ? null : Number(value);
  const expectedBudgetMin = parseBudget(parsed.data.expectedBudgetMin);
  const expectedBudgetMax = parseBudget(parsed.data.expectedBudgetMax);
  if ((expectedBudgetMin !== undefined && expectedBudgetMin !== null && (!Number.isInteger(expectedBudgetMin) || expectedBudgetMin < 50_000)) || (expectedBudgetMax !== undefined && expectedBudgetMax !== null && (!Number.isInteger(expectedBudgetMax) || expectedBudgetMax < 50_000))) return { error: "Ekspektasi budget minimal Rp50.000" };
  if ((expectedBudgetMin === null) !== (expectedBudgetMax === null) || (typeof expectedBudgetMin === "number" && typeof expectedBudgetMax === "number" && expectedBudgetMin > expectedBudgetMax)) return { error: "Rentang ekspektasi budget tidak valid" };
  const avatar = validateAvatar(parsed.data.avatarBase64);
  if (avatar.error) return { error: avatar.error };

  const portfolioUrl = normalizeOptionalUrl(parsed.data.portfolioUrl);
  const businessWebsite = normalizeOptionalUrl(parsed.data.businessWebsite);
  const github = normalizeOptionalUrl(
    parsed.data.github,
    new Set(["github.com", "www.github.com"]),
  );
  const linkedin = normalizeOptionalUrl(
    parsed.data.linkedin,
    new Set(["linkedin.com", "www.linkedin.com"]),
  );
  const behance = normalizeOptionalUrl(
    parsed.data.behance,
    new Set(["behance.net", "www.behance.net"]),
  );
  const invalidUrl = [businessWebsite, portfolioUrl, github, linkedin, behance].find(
    (result) => result.error,
  );
  if (invalidUrl?.error) return { error: invalidUrl.error };

  let semester: number | null | undefined;
  if (parsed.data.tingkat_pendidikan !== undefined) {
    const level = parsed.data.tingkat_pendidikan;
    if (!level || !educationUsesSemester(level)) {
      semester = null;
    } else if (!parsed.data.semester) {
      semester = null;
    } else {
      semester = Number(parsed.data.semester);
      if (!Number.isInteger(semester) || semester < 1 || semester > 20) {
        return { error: "Semester harus berupa angka antara 1 dan 20" };
      }
    }
  }

  const isPublicProfile =
    parsed.data.publicProfileSubmitted === "1"
      ? parsed.data.isPublicProfile === "on"
      : undefined;
  const available =
    parsed.data.availabilitySubmitted === "1"
      ? parsed.data.available === "on"
      : undefined;

  try {
    await prisma.$transaction(async (transaction) => {
      await transaction.user.update({
        where: { id: session.userId },
        data: {
          name: parsed.data.name,
          ...(validatedRegion
            ? { location: formatRegionLocation(validatedRegion) }
            : parsed.data.location !== undefined
              ? { location: parsed.data.location || null }
              : {}),
          ...(parsed.data.about !== undefined
            ? { bio: parsed.data.about || null }
            : {}),
          ...(parsed.data.phone !== undefined
            ? { no_telepon: parsed.data.phone || null }
            : {}),
          ...(portfolioUrl.value !== undefined ? { portfolioUrl: portfolioUrl.value } : {}),
          ...(github.value !== undefined ? { github: github.value } : {}),
          ...(linkedin.value !== undefined ? { linkedin: linkedin.value } : {}),
          ...(behance.value !== undefined ? { behance: behance.value } : {}),
          ...(avatar.avatar ? { avatar: avatar.avatar } : {}),
        },
      });

      if (authenticatedUser.role === "STUDENT") {
        const student = await transaction.student.upsert({
          where: { userId: session.userId },
          update: {
            ...(isPublicProfile !== undefined ? { isPublicProfile } : {}),
            ...(available !== undefined ? { available } : {}),
            ...(expectedBudgetMin !== undefined ? { expectedBudgetMin } : {}),
            ...(expectedBudgetMax !== undefined ? { expectedBudgetMax } : {}),
            ...(parsed.data.headline !== undefined
              ? { jurusan: parsed.data.headline || null }
              : {}),
            ...(parsed.data.school !== undefined
              ? { school: parsed.data.school || null }
              : {}),
            ...(parsed.data.tingkat_pendidikan !== undefined
              ? { tingkat_pendidikan: parsed.data.tingkat_pendidikan || null }
              : {}),
            ...(semester !== undefined ? { semester } : {}),
            ...(validatedRegion
              ? {
                  alamat_detail: parsed.data.addressDetail!,
                  provinsi_kode: validatedRegion.provinceCode,
                  provinsi_nama: validatedRegion.provinceName,
                  kabupaten_kode: validatedRegion.regencyCode,
                  kabupaten_nama: validatedRegion.regencyName,
                  kecamatan_kode: validatedRegion.districtCode,
                  kecamatan_nama: validatedRegion.districtName,
                  kelurahan_kode: validatedRegion.villageCode,
                  kelurahan_nama: validatedRegion.villageName,
                }
              : {}),
          },
          create: {
            userId: session.userId,
            isPublicProfile: isPublicProfile ?? false,
            available: available ?? false,
            expectedBudgetMin: expectedBudgetMin ?? null,
            expectedBudgetMax: expectedBudgetMax ?? null,
            jurusan: parsed.data.headline || null,
            school: parsed.data.school || null,
            tingkat_pendidikan: parsed.data.tingkat_pendidikan || null,
            semester: semester ?? null,
            ...(validatedRegion
              ? {
                  alamat_detail: parsed.data.addressDetail!,
                  provinsi_kode: validatedRegion.provinceCode,
                  provinsi_nama: validatedRegion.provinceName,
                  kabupaten_kode: validatedRegion.regencyCode,
                  kabupaten_nama: validatedRegion.regencyName,
                  kecamatan_kode: validatedRegion.districtCode,
                  kecamatan_nama: validatedRegion.districtName,
                  kelurahan_kode: validatedRegion.villageCode,
                  kelurahan_nama: validatedRegion.villageName,
                }
              : {}),
          },
          select: { id: true },
        });

        if (parsedSkills?.skills) {
          const currentStudentSkills = await transaction.student_skill.findMany({
            where: { studentId: student.id },
            select: { skill: { select: { name: true } } },
          });
          const retainedLegacySkills = new Map(
            currentStudentSkills.map(({ skill }) => [
              skill.name.toLocaleLowerCase("id-ID"),
              skill.name,
            ]),
          );
          const allowedSkillNames = parsedSkills.skills.map((skillName) => {
            const canonicalName = getCanonicalSkillName(skillName);
            const retainedLegacyName = retainedLegacySkills.get(
              skillName.toLocaleLowerCase("id-ID"),
            );
            if (!canonicalName && !retainedLegacyName) {
              throw new ProfileInputError(
                "Skill baru harus dipilih dari daftar resmi Jembara.",
              );
            }
            return canonicalName ?? retainedLegacyName!;
          });

          const selectedSkills: Array<{ id: string }> = [];
          for (const skillName of allowedSkillNames) {
            const skill = await transaction.skill.findFirst({
              where: { name: { equals: skillName, mode: "insensitive" } },
              select: { id: true },
            });
            if (!skill) {
              throw new Error(`Master skill tidak tersedia: ${skillName}`);
            }
            selectedSkills.push(skill);
          }

          const selectedSkillIds = selectedSkills.map(({ id }) => id);
          await transaction.student_skill.deleteMany({
            where: { studentId: student.id, skillId: { notIn: selectedSkillIds } },
          });
          for (const skill of selectedSkills) {
            const skillName = allowedSkillNames[selectedSkills.indexOf(skill)];
            const level = skillLevels[skillName.toLocaleLowerCase("id-ID")] ?? "BEGINNER";
            await transaction.student_skill.upsert({
              where: { studentId_skillId: { studentId: student.id, skillId: skill.id } },
              update: { level },
              create: { studentId: student.id, skillId: skill.id, level },
              select: { id: true },
            });
          }
        }
      } else {
        await transaction.umkm.upsert({
          where: { userId: session.userId },
          update: {
            nama_usaha: parsed.data.businessName!,
            kategori_usaha: validatedBusinessCategory!,
            ...(businessWebsite.value !== undefined
              ? { website: businessWebsite.value }
              : {}),
            alamat_detail: parsed.data.addressDetail!,
            provinsi_kode: validatedRegion!.provinceCode,
            provinsi_nama: validatedRegion!.provinceName,
            kabupaten_kode: validatedRegion!.regencyCode,
            kabupaten_nama: validatedRegion!.regencyName,
            kecamatan_kode: validatedRegion!.districtCode,
            kecamatan_nama: validatedRegion!.districtName,
            kelurahan_kode: validatedRegion!.villageCode,
            kelurahan_nama: validatedRegion!.villageName,
          },
          create: {
            userId: session.userId,
            nama_usaha: parsed.data.businessName!,
            kategori_usaha: validatedBusinessCategory!,
            website: businessWebsite.value ?? null,
            alamat_detail: parsed.data.addressDetail!,
            provinsi_kode: validatedRegion!.provinceCode,
            provinsi_nama: validatedRegion!.provinceName,
            kabupaten_kode: validatedRegion!.regencyCode,
            kabupaten_nama: validatedRegion!.regencyName,
            kecamatan_kode: validatedRegion!.districtCode,
            kecamatan_nama: validatedRegion!.districtName,
            kelurahan_kode: validatedRegion!.villageCode,
            kelurahan_nama: validatedRegion!.villageName,
          },
        });
      }
    });
  } catch (error) {
    if (error instanceof ProfileInputError) return { error: error.message };
    console.error("Failed to update profile:", error);
    return { error: "Gagal memperbarui profil" };
  }

  try {
    await createUserNotification({
      userId: session.userId,
      type: "INFO",
      title: "Profil berhasil diperbarui",
      message: "Perubahan profil Anda telah tersimpan di JemBara.",
      href: "/dashboard/profile",
    });
  } catch (error) {
    console.error("Failed to create profile notification:", error);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/profile");
  revalidatePath("/dashboard/settings");
  revalidatePath("/");
  return { success: true };
}
