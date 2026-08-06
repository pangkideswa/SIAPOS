import "server-only"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

export const prismaAdapter = PrismaAdapter(prisma)
