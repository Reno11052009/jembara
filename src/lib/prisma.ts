import { PrismaClient } from "@/generated/prisma/client";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import { createDatabasePoolConfig } from "./database-connection";

const prismaClientSingleton = () => {
  const pool = new Pool(
    createDatabasePoolConfig(process.env.DATABASE_URL, "DATABASE_URL"),
  );
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
};

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

const isPrismaClient = (
  client: ReturnType<typeof prismaClientSingleton> | undefined,
): client is ReturnType<typeof prismaClientSingleton> =>
  typeof client?.user?.findFirst === "function" &&
  typeof client?.notification?.findMany === "function";

const prisma = isPrismaClient(globalThis.prismaGlobal)
  ? globalThis.prismaGlobal
  : prismaClientSingleton();

export default prisma;

if (process.env.NODE_ENV !== "production") {
  globalThis.prismaGlobal = prisma;
}
