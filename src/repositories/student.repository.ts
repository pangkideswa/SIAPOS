import "server-only"
import { prisma } from "@/lib/prisma"
import type { Student, Prisma } from "@/generated/prisma/client"

export type StudentCreateData = Prisma.StudentUncheckedCreateInput
export type StudentUpdateData = Prisma.StudentUncheckedUpdateInput
export type StudentWhere = Prisma.StudentWhereInput
export type StudentFindManyArgs = Prisma.StudentFindManyArgs

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

  async findMany(args: StudentFindManyArgs): Promise<Student[]> {
    return prisma.student.findMany({
      ...args,
      orderBy: { nama_lengkap: "asc" },
    })
  },

  async count(where: StudentWhere): Promise<number> {
    return prisma.student.count({ where })
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
