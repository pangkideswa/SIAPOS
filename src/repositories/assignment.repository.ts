import "server-only"
import { prisma } from "@/lib/prisma"
import type {
  Assignment,
  Prisma,
} from "@/generated/prisma/client"

export type AssignmentCreateData = Prisma.AssignmentUncheckedCreateInput
export type AssignmentUpdateData = Prisma.AssignmentUncheckedUpdateInput
export type AssignmentWhere = Prisma.AssignmentWhereInput

export const assignmentRepository = {
  async findAll(): Promise<Assignment[]> {
    return prisma.assignment.findMany({
      orderBy: { created_at: "desc" },
    })
  },

  async findById(id: number): Promise<Assignment | null> {
    return prisma.assignment.findUnique({ where: { id } })
  },

  async findByTeachingClassId(teachingClassId: number): Promise<Assignment[]> {
    return prisma.assignment.findMany({
      where: { teaching_class_id: teachingClassId },
      orderBy: { created_at: "desc" },
    })
  },

  async findMany(where: AssignmentWhere): Promise<Assignment[]> {
    return prisma.assignment.findMany({
      where,
      orderBy: { created_at: "desc" },
    })
  },

  async create(data: AssignmentCreateData): Promise<Assignment> {
    return prisma.assignment.create({ data })
  },

  async update(
    id: number,
    data: AssignmentUpdateData
  ): Promise<Assignment | null> {
    return prisma.assignment.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.assignment.delete({ where: { id } })
  },
}
