import "server-only"
import { prisma } from "@/lib/prisma"
import type { Classroom, Prisma } from "@/generated/prisma/client"

export type ClassroomCreateData = Prisma.ClassroomUncheckedCreateInput
export type ClassroomUpdateData = Prisma.ClassroomUncheckedUpdateInput
export type ClassroomWhere = Prisma.ClassroomWhereInput
export type ClassroomFindManyArgs = Prisma.ClassroomFindManyArgs

export const classroomRepository = {
  async findAll(): Promise<Classroom[]> {
    return prisma.classroom.findMany({
      orderBy: { name: "asc" },
    })
  },

  async findById(id: number): Promise<Classroom | null> {
    return prisma.classroom.findUnique({ where: { id } })
  },

  async findFirst(where: ClassroomWhere): Promise<Classroom | null> {
    return prisma.classroom.findFirst({ where })
  },

  async findMany(args: ClassroomFindManyArgs): Promise<Classroom[]> {
    return prisma.classroom.findMany(args)
  },

  async count(where: ClassroomWhere): Promise<number> {
    return prisma.classroom.count({ where })
  },

  async create(data: ClassroomCreateData): Promise<Classroom> {
    return prisma.classroom.create({ data })
  },

  async update(
    id: number,
    data: ClassroomUpdateData
  ): Promise<Classroom | null> {
    return prisma.classroom.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.classroom.delete({ where: { id } })
  },
}
