import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaClient } from "../src/generated/prisma/client";

const DEFAULT_ADMIN_EMAIL = "admin@jembara.web.id";
const DEFAULT_ADMIN_NAME = "Admin Jembara";
const DEFAULT_ADMIN_PASSWORD = "admin123";
const MAX_BCRYPT_PASSWORD_BYTES = 72;

const connectionString = process.env.DIRECT_URL ?? process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DIRECT_URL atau DATABASE_URL wajib tersedia untuk menjalankan seeder.");
}

const adminEmail = (DEFAULT_ADMIN_EMAIL)
  .trim()
  .toLowerCase();
const adminName = (DEFAULT_ADMIN_NAME).trim();
const adminPassword = DEFAULT_ADMIN_PASSWORD;

if (!adminEmail || !adminEmail.includes("@")) {
  throw new Error("ADMIN_SEED_EMAIL harus berisi alamat email yang valid.");
}

if (adminName.length < 3) {
  throw new Error("ADMIN_SEED_NAME minimal terdiri dari 3 karakter.");
}

if (
  adminPassword.length < 8 ||
  Buffer.byteLength(adminPassword, "utf8") > MAX_BCRYPT_PASSWORD_BYTES
) {
  throw new Error("ADMIN_SEED_PASSWORD harus berisi 8-72 byte.");
}

const pool = new Pool({ connectionString });
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

  const passwordHash =
    existingUser && (await bcrypt.compare(adminPassword, existingUser.password))
      ? existingUser.password
      : await bcrypt.hash(adminPassword, 10);

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
      email: true,
      name: true,
      role: true,
      admin: { select: { id: true } },
    },
  });

  console.info("Seeder admin selesai:", adminUser);
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
