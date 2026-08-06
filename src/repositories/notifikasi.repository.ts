import "server-only"
import { prisma } from "@/lib/prisma"
import type {
  Notifikasi,
  Prisma,
} from "@/generated/prisma/client"

export type NotifikasiCreateData = Prisma.NotifikasiUncheckedCreateInput
export type NotifikasiUpdateData = Prisma.NotifikasiUncheckedUpdateInput

export const notifikasiRepository = {
  async findAll(): Promise<Notifikasi[]> {
    return prisma.notifikasi.findMany({
      orderBy: { created_at: "desc" },
    })
  },

  async findAllByRoles(roles: string[]): Promise<Notifikasi[]> {
    return prisma.notifikasi.findMany({
      where: { targetRoles: { hasSome: roles } },
      orderBy: { created_at: "desc" },
    })
  },

  async findById(id: number): Promise<Notifikasi | null> {
    return prisma.notifikasi.findUnique({ where: { id } })
  },

  async create(data: NotifikasiCreateData): Promise<Notifikasi> {
    return prisma.notifikasi.create({ data })
  },

  async update(
    id: number,
    data: NotifikasiUpdateData
  ): Promise<Notifikasi | null> {
    return prisma.notifikasi.update({ where: { id }, data })
  },

  async markListRead(ids: number[]): Promise<number> {
    const result = await prisma.notifikasi.updateMany({
      where: { id: { in: ids }, is_read: false },
      data: { is_read: true },
    })
    return result.count
  },

  async markAllReadByRoles(roles: string[]): Promise<number> {
    const result = await prisma.notifikasi.updateMany({
      where: { targetRoles: { hasSome: roles }, is_read: false },
      data: { is_read: true },
    })
    return result.count
  },
}
