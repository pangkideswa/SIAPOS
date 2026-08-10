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

  async findAllByUserId(userId: number): Promise<Notifikasi[]> {
    return prisma.notifikasi.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    })
  },

  async findById(id: number): Promise<Notifikasi | null> {
    return prisma.notifikasi.findUnique({ where: { id } })
  },

  async create(data: NotifikasiCreateData): Promise<Notifikasi> {
    return prisma.notifikasi.create({ data })
  },

  async createMany(data: NotifikasiCreateData[]): Promise<number> {
    const result = await prisma.notifikasi.createMany({ data })
    return result.count
  },

  async update(
    id: number,
    data: NotifikasiUpdateData
  ): Promise<Notifikasi | null> {
    return prisma.notifikasi.update({ where: { id }, data })
  },

  async markReadOwned(id: number, userId: number): Promise<boolean> {
    const result = await prisma.notifikasi.updateMany({
      where: { id, user_id: userId, is_read: false },
      data: { is_read: true },
    })
    return result.count > 0
  },

  async markListReadOwned(ids: number[], userId: number): Promise<number> {
    const result = await prisma.notifikasi.updateMany({
      where: { id: { in: ids }, user_id: userId, is_read: false },
      data: { is_read: true },
    })
    return result.count
  },

  async markAllReadByUserId(userId: number): Promise<number> {
    const result = await prisma.notifikasi.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    })
    return result.count
  },
}
