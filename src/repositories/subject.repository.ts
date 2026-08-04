import "server-only"
import { prisma } from "@/lib/prisma"
import type { Subject, Prisma } from "@/generated/prisma/client"

export type SubjectCreateData = Prisma.SubjectUncheckedCreateInput
export type SubjectUpdateData = Prisma.SubjectUncheckedUpdateInput
export type SubjectWhere = Prisma.SubjectWhereInput
export type SubjectFindManyArgs = Prisma.SubjectFindManyArgs

export const subjectRepository = {
  async findAll(): Promise<Subject[]> {
    return prisma.subject.findMany({
      orderBy: { name: "asc" },
    })
  },

  async findById(id: number): Promise<Subject | null> {
    return prisma.subject.findUnique({ where: { id } })
  },

  async findMany(args: SubjectFindManyArgs): Promise<Subject[]> {
    return prisma.subject.findMany(args)
  },

  async count(where: SubjectWhere): Promise<number> {
    return prisma.subject.count({ where })
  },

  async create(data: SubjectCreateData): Promise<Subject> {
    return prisma.subject.create({ data })
  },

  async update(id: number, data: SubjectUpdateData): Promise<Subject | null> {
    return prisma.subject.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.subject.delete({ where: { id } })
  },
}
