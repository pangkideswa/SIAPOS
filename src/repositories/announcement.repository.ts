import "server-only"
import { prisma } from "@/lib/prisma"
import type {
  Announcement,
  Prisma,
} from "@/generated/prisma/client"

export type AnnouncementCreateData = Prisma.AnnouncementUncheckedCreateInput
export type AnnouncementUpdateData = Prisma.AnnouncementUncheckedUpdateInput
export type AnnouncementWhere = Prisma.AnnouncementWhereInput

export const announcementRepository = {
  async findAll(): Promise<Announcement[]> {
    return prisma.announcement.findMany({
      orderBy: [{ pinned: "desc" }, { created_at: "desc" }],
    })
  },

  async findById(id: number): Promise<Announcement | null> {
    return prisma.announcement.findUnique({ where: { id } })
  },

  async findMany(where: AnnouncementWhere): Promise<Announcement[]> {
    return prisma.announcement.findMany({
      where,
      orderBy: [{ pinned: "desc" }, { created_at: "desc" }],
    })
  },

  async create(data: AnnouncementCreateData): Promise<Announcement> {
    return prisma.announcement.create({ data })
  },

  async update(
    id: number,
    data: AnnouncementUpdateData
  ): Promise<Announcement | null> {
    return prisma.announcement.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.announcement.delete({ where: { id } })
  },
}
