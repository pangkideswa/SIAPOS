import "server-only"
import { prisma } from "@/lib/prisma"
import type { Schedule, Prisma } from "@/generated/prisma/client"

export type ScheduleCreateData = Prisma.ScheduleUncheckedCreateInput
export type ScheduleUpdateData = Prisma.ScheduleUncheckedUpdateInput
export type ScheduleWhere = Prisma.ScheduleWhereInput

export const scheduleRepository = {
  async findAll(): Promise<Schedule[]> {
    return prisma.schedule.findMany({
      orderBy: [{ hari: "asc" }, { jam_mulai: "asc" }],
    })
  },

  async findById(id: number): Promise<Schedule | null> {
    return prisma.schedule.findUnique({ where: { id } })
  },

  async findMany(where: ScheduleWhere): Promise<Schedule[]> {
    return prisma.schedule.findMany({
      where,
      orderBy: [{ hari: "asc" }, { jam_mulai: "asc" }],
    })
  },

  async create(data: ScheduleCreateData): Promise<Schedule> {
    return prisma.schedule.create({ data })
  },

  async update(id: number, data: ScheduleUpdateData): Promise<Schedule | null> {
    return prisma.schedule.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.schedule.delete({ where: { id } })
  },
}
