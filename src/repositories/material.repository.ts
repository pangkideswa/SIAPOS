import "server-only"
import { prisma } from "@/lib/prisma"
import type {
  Material,
  Prisma,
} from "@/generated/prisma/client"

export type MaterialCreateData = Prisma.MaterialUncheckedCreateInput
export type MaterialUpdateData = Prisma.MaterialUncheckedUpdateInput
export type MaterialWhere = Prisma.MaterialWhereInput

export const materialRepository = {
  async findAll(): Promise<Material[]> {
    return prisma.material.findMany({
      orderBy: { created_at: "desc" },
    })
  },

  async findById(id: number): Promise<Material | null> {
    return prisma.material.findUnique({ where: { id } })
  },

  async findByTeachingClassId(teachingClassId: number): Promise<Material[]> {
    return prisma.material.findMany({
      where: { teaching_class_id: teachingClassId },
      orderBy: { created_at: "desc" },
    })
  },

  async findMany(where: MaterialWhere): Promise<Material[]> {
    return prisma.material.findMany({
      where,
      orderBy: { created_at: "desc" },
    })
  },

  async create(data: MaterialCreateData): Promise<Material> {
    return prisma.material.create({ data })
  },

  async update(id: number, data: MaterialUpdateData): Promise<Material | null> {
    return prisma.material.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.material.delete({ where: { id } })
  },
}
