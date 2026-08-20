import { PrismaClient } from "@/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  // Database connection temporarily disabled
  // const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  // const adapter = new PrismaPg(pool);
  // return new PrismaClient({ adapter });
  
  return {} as unknown as PrismaClient; // Mock PrismaClient
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
