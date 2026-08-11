import "server-only"
import { prisma } from "@/lib/prisma"
import type { User, Prisma } from "@/generated/prisma/client"

export type UserCreateData = Prisma.UserUncheckedCreateInput
export type UserUpdateData = Prisma.UserUncheckedUpdateInput
export type UserWhere = Prisma.UserWhereInput
export type UserFindManyArgs = Prisma.UserFindManyArgs

export const userRepository = {
  async findAll(): Promise<User[]> {
    return prisma.user.findMany({
      orderBy: { created_at: "desc" },
    })
  },

  async findById(id: number): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  },

  async findUserIdsByRoles(roles: string[]): Promise<number[]> {
    if (!roles || roles.length === 0) return []
    const prismaRoles = roles.map(r => r.toUpperCase() as import("@/generated/prisma/client").Role)
    const users = await prisma.user.findMany({
      where: { role: { in: prismaRoles } },
      select: { id: true }
    })
    return users.map(u => u.id)
  },

  async findFirst(where: UserWhere): Promise<User | null> {
    return prisma.user.findFirst({ where })
  },

  async findByIdentifier(identifier: string): Promise<User | null> {
    return prisma.user.findFirst({
      where: {
        OR: [
          { email: identifier.toLowerCase() },
          { username: identifier },
          { nip: identifier },
          { nisn: identifier },
          { name: { equals: identifier, mode: "insensitive" } },
        ],
      },
    })
  },

  async findMany(args: UserFindManyArgs): Promise<User[]> {
    return prisma.user.findMany(args)
  },

  async count(where: UserWhere): Promise<number> {
    return prisma.user.count({ where })
  },

  async create(data: UserCreateData): Promise<User> {
    return prisma.user.create({ data })
  },

  async update(id: number, data: UserUpdateData): Promise<User | null> {
    return prisma.user.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.user.delete({ where: { id } })
  },
}
