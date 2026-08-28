import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";
import { createDatabasePoolConfig } from "../src/lib/database-connection";

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

  const adminUser = await prisma.$transaction(async (transaction) => {
    const user = await transaction.user.upsert({
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

    if (existingUser && !passwordAlreadyMatches) {
      await transaction.auth_session.deleteMany({ where: { userId: existingUser.id } });
    }
    return user;
  });

  console.info("Seeder admin selesai:", {
    role: adminUser.role,
    adminProfileReady: Boolean(adminUser.admin),
    passwordRotated: Boolean(existingUser && !passwordAlreadyMatches),
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
