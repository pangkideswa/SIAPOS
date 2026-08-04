import "server-only"
import { prisma } from "@/lib/prisma"
import type { Student, Prisma } from "@/generated/prisma/client"

export type StudentCreateData = Prisma.StudentUncheckedCreateInput
export type StudentUpdateData = Prisma.StudentUncheckedUpdateInput
export type StudentWhere = Prisma.StudentWhereInput

export const studentRepository = {
  async findAll(): Promise<Student[]> {
    return prisma.student.findMany({
      orderBy: { nama_lengkap: "asc" },
    })
  },

  async findById(id: number): Promise<Student | null> {
    return prisma.student.findUnique({ where: { id } })
  },

  async findFirst(where: StudentWhere): Promise<Student | null> {
    return prisma.student.findFirst({ where })
  },

  async findMany(where: StudentWhere): Promise<Student[]> {
    return prisma.student.findMany({
      where,
      orderBy: { nama_lengkap: "asc" },
    })
  },

  async findByClassroomId(classroomId: number): Promise<Student[]> {
    return prisma.student.findMany({
      where: { classroom_id: classroomId },
      orderBy: { nama_lengkap: "asc" },
    })
  },

  async create(data: StudentCreateData): Promise<Student> {
    return prisma.student.create({ data })
  },

  async update(id: number, data: StudentUpdateData): Promise<Student | null> {
    return prisma.student.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.student.delete({ where: { id } })
  },
}
