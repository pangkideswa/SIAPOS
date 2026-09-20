import "server-only"
import { PrismaClient } from "@/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const globalForPrisma = globalThis as unknown as {
  prisma_v2?: PrismaClient
}

import { Pool } from "pg"

function createPrismaClient(): PrismaClient {
  const connectionString = process.env.SUPABASE_DATABASE_URL ?? process.env.DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/siapos";
  const pool = new Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  return new PrismaClient({ adapter })
}

export const prisma: PrismaClient =
  globalForPrisma.prisma_v2 ?? createPrismaClient()

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma_v2 = prisma
}
