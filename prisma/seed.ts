import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDatabasePoolConfig } from "../src/lib/database-connection";
import {
  skillTaxonomy,
  skillTaxonomyGroups,
} from "../src/lib/skill-taxonomy";
import { businessCategorySeeds } from "../src/lib/business-category-taxonomy";

const MAX_BCRYPT_PASSWORD_BYTES = 72;
const MINIMUM_ADMIN_PASSWORD_BYTES = 16;
const INSECURE_ADMIN_PASSWORDS = new Set([
  "admin123",
  "JembaraAdmin#2026",
  "password",
]);

function requiredEnvironmentValue(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`${name} wajib tersedia untuk menjalankan seeder.`);
  return value;
}

const adminEmail = requiredEnvironmentValue("ADMIN_SEED_EMAIL").toLowerCase();
const adminName = requiredEnvironmentValue("ADMIN_SEED_NAME");
const adminPassword = requiredEnvironmentValue("ADMIN_SEED_PASSWORD");
const demoStudentEmail = process.env.DEMO_STUDENT_EMAIL?.trim().toLowerCase();
const demoStudentPassword = process.env.DEMO_STUDENT_PASSWORD?.trim();
const demoUmkmEmail = process.env.DEMO_UMKM_EMAIL?.trim().toLowerCase();
const demoUmkmPassword = process.env.DEMO_UMKM_PASSWORD?.trim();

if (!adminEmail || !adminEmail.includes("@")) {
  throw new Error("ADMIN_SEED_EMAIL harus berisi alamat email yang valid.");
}

if (adminName.length < 3) {
  throw new Error("ADMIN_SEED_NAME minimal terdiri dari 3 karakter.");
}

if (
  Buffer.byteLength(adminPassword, "utf8") < MINIMUM_ADMIN_PASSWORD_BYTES ||
  Buffer.byteLength(adminPassword, "utf8") > MAX_BCRYPT_PASSWORD_BYTES
) {
  throw new Error("ADMIN_SEED_PASSWORD harus berisi 16-72 byte.");
}
if (
  INSECURE_ADMIN_PASSWORDS.has(adminPassword) ||
  !/[a-z]/.test(adminPassword) ||
  !/[A-Z]/.test(adminPassword) ||
  !/\d/.test(adminPassword) ||
  !/[^A-Za-z0-9]/.test(adminPassword)
) {
  throw new Error(
    "ADMIN_SEED_PASSWORD harus unik dan memuat huruf kecil, huruf besar, angka, serta simbol.",
  );
}

const pool = new Pool(
  createDatabasePoolConfig(process.env.DIRECT_URL, "DIRECT_URL"),
);
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.skill.createMany({
    data: skillTaxonomy.map(({ name, category }) => ({ name, category })),
    skipDuplicates: true,
  });

  for (const group of skillTaxonomyGroups) {
    await prisma.skill.updateMany({
      where: { name: { in: [...group.skills] } },
      data: { category: group.category },
    });
  }

  const seededSkills = await prisma.skill.count({
    where: { name: { in: skillTaxonomy.map(({ name }) => name) } },
  });

  await prisma.business_category.createMany({
    data: businessCategorySeeds.map(({ name, groupName, groupOrder, sortOrder }) => ({
      name,
      groupName,
      groupOrder,
      sortOrder,
    })),
    skipDuplicates: true,
  });

  // Query langsung dipakai agar seeder tetap stabil pada connection pooler
  // Supabase yang membatasi interactive transaction berdurasi panjang.
  for (const category of businessCategorySeeds) {
    await prisma.business_category.update({
      where: { name: category.name },
      data: {
        groupName: category.groupName,
        groupOrder: category.groupOrder,
        isActive: true,
        sortOrder: category.sortOrder,
      },
    });
  }

  await prisma.business_category.updateMany({
    where: { name: { notIn: businessCategorySeeds.map(({ name }) => name) } },
    data: { isActive: false },
  });

  const seededBusinessCategories = await prisma.business_category.count({
    where: { name: { in: businessCategorySeeds.map(({ name }) => name) } },
  });

  const existingUser = await prisma.user.findFirst({
    where: { email: { equals: adminEmail, mode: "insensitive" } },
    select: {
      id: true,
      email: true,
      password: true,
      role: true,
    },
  });

  if (existingUser && existingUser.role !== "ADMIN") {
    throw new Error(
      `Email ${adminEmail} sudah digunakan akun ${existingUser.role}. Gunakan ADMIN_SEED_EMAIL lain agar akun tersebut tidak diubah menjadi admin.`,
    );
  }

  const passwordAlreadyMatches = Boolean(
    existingUser && (await bcrypt.compare(adminPassword, existingUser.password)),
  );
  const passwordHash = passwordAlreadyMatches
    ? existingUser!.password
    : await bcrypt.hash(adminPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email: existingUser?.email ?? adminEmail },
    update: {
      email: adminEmail,
      name: adminName,
      password: passwordHash,
      role: "ADMIN",
      admin: {
        upsert: {
          create: {},
          update: {},
        },
      },
    },
    create: {
      email: adminEmail,
      name: adminName,
      password: passwordHash,
      role: "ADMIN",
      admin: { create: {} },
    },
    select: {
      id: true,
      role: true,
      admin: { select: { id: true } },
    },
  });

  if (demoStudentEmail && demoStudentPassword && demoUmkmEmail && demoUmkmPassword) {
    if (demoStudentPassword.length < 8 || demoUmkmPassword.length < 8) throw new Error("Password akun demo minimal 8 karakter.");
    const [studentPasswordHash, umkmPasswordHash, demoSkills] = await Promise.all([
      bcrypt.hash(demoStudentPassword, 10),
      bcrypt.hash(demoUmkmPassword, 10),
      prisma.skill.findMany({ where: { name: { in: ["Web Development", "UI/UX Design", "Digital Marketing"] } }, select: { id: true, name: true } }),
    ]);
    const studentUser = await prisma.user.upsert({ where: { email: demoStudentEmail }, update: { name: "Talent Demo Jembara", password: studentPasswordHash, role: "STUDENT" }, create: { email: demoStudentEmail, name: "Talent Demo Jembara", password: studentPasswordHash, role: "STUDENT" }, select: { id: true } });
    const student = await prisma.student.upsert({ where: { userId: studentUser.id }, update: { school: "Sekolah Mitra Jembara", jurusan: "Rekayasa Perangkat Lunak", available: true, isPublicProfile: true, expectedBudgetMin: 500_000, expectedBudgetMax: 3_000_000 }, create: { userId: studentUser.id, school: "Sekolah Mitra Jembara", jurusan: "Rekayasa Perangkat Lunak", available: true, isPublicProfile: true, expectedBudgetMin: 500_000, expectedBudgetMax: 3_000_000 } });
    for (const [index, skill] of demoSkills.entries()) await prisma.student_skill.upsert({ where: { studentId_skillId: { studentId: student.id, skillId: skill.id } }, update: { level: index === 0 ? "ADVANCED" : "INTERMEDIATE" }, create: { studentId: student.id, skillId: skill.id, level: index === 0 ? "ADVANCED" : "INTERMEDIATE" } });
    const umkmUser = await prisma.user.upsert({ where: { email: demoUmkmEmail }, update: { name: "Pemilik UMKM Demo", password: umkmPasswordHash, role: "UMKM" }, create: { email: demoUmkmEmail, name: "Pemilik UMKM Demo", password: umkmPasswordHash, role: "UMKM" }, select: { id: true } });
    const demoUmkm = await prisma.umkm.upsert({ where: { userId: umkmUser.id }, update: { nama_usaha: "UMKM Demo Jembara", kategori_usaha: "Kuliner" }, create: { userId: umkmUser.id, nama_usaha: "UMKM Demo Jembara", kategori_usaha: "Kuliner" } });
    const existingProject = await prisma.project.findFirst({ where: { umkmId: demoUmkm.id, title: "Website Katalog Produk UMKM" }, select: { id: true } });
    if (!existingProject && demoSkills.length) await prisma.project.create({ data: { umkmId: demoUmkm.id, title: "Website Katalog Produk UMKM", description: "Membangun website katalog responsif untuk menampilkan produk, profil usaha, dan kontak pemesanan UMKM.", budget: 2_500_000, deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), status: "OPEN", workMode: "REMOTE", skillsNeeded: { create: demoSkills.slice(0, 2).map((skill, index) => ({ skillId: skill.id, required: index === 0 })) } } });
    console.info("Seeder akun demo selesai tanpa mencetak kredensial.");
  }

  if (existingUser && !passwordAlreadyMatches) {
    await prisma.auth_session.deleteMany({ where: { userId: existingUser.id } });
  }

  console.info("Seeder admin selesai:", {
    role: adminUser.role,
    adminProfileReady: Boolean(adminUser.admin),
    passwordRotated: Boolean(existingUser && !passwordAlreadyMatches),
  });
  console.info("Seeder master skill selesai:", {
    expected: skillTaxonomy.length,
    available: seededSkills,
  });
  console.info("Seeder master kategori usaha selesai:", {
    expected: businessCategorySeeds.length,
    available: seededBusinessCategories,
  });
}

main()
  .catch((error: unknown) => {
    console.error("Seeder admin gagal:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
