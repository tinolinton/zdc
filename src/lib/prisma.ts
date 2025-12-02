import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set.");
}

const hasAppSetting = (client?: PrismaClient) =>
  Boolean(client && "appSetting" in client);

const prisma =
  !globalForPrisma.prisma || !hasAppSetting(globalForPrisma.prisma)
    ? new PrismaClient({
        adapter: new PrismaPg({ connectionString: databaseUrl }),
      })
    : globalForPrisma.prisma;

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
