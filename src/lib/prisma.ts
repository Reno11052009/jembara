import { PrismaClient } from "@/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const prismaClientSingleton = () => {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaClientV2: undefined | ReturnType<typeof prismaClientSingleton>;
}

const prisma = globalThis.prismaClientV2 ?? prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") globalThis.prismaClientV2 = prisma;
