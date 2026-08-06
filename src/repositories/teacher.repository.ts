import "server-only"
import { prisma } from "@/lib/prisma"
import type { Teacher, Prisma } from "@/generated/prisma/client"

export type TeacherCreateData = Prisma.TeacherUncheckedCreateInput
export type TeacherUpdateData = Prisma.TeacherUncheckedUpdateInput
export type TeacherWhere = Prisma.TeacherWhereInput
export type TeacherFindManyArgs = Prisma.TeacherFindManyArgs

export const teacherRepository = {
  async findAll(): Promise<Teacher[]> {
    return prisma.teacher.findMany({
      orderBy: { nama_lengkap: "asc" },
    })
  },

  async findById(id: number): Promise<Teacher | null> {
    return prisma.teacher.findUnique({ where: { id } })
  },

  async findFirst(where: TeacherWhere): Promise<Teacher | null> {
    return prisma.teacher.findFirst({ where })
  },

  async findMany(args: TeacherFindManyArgs): Promise<Teacher[]> {
    return prisma.teacher.findMany({
      ...args,
      orderBy: { nama_lengkap: "asc" },
    })
  },

  async count(where: TeacherWhere): Promise<number> {
    return prisma.teacher.count({ where })
  },

  async create(data: TeacherCreateData): Promise<Teacher> {
    return prisma.teacher.create({ data })
  },

  async update(
    id: number,
    data: TeacherUpdateData
  ): Promise<Teacher | null> {
    return prisma.teacher.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.teacher.delete({ where: { id } })
  },
}
