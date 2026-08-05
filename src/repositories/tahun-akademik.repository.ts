import "server-only"
import { prisma } from "@/lib/prisma"
import type { TahunAkademik, Prisma } from "@/generated/prisma/client"

export type TahunAkademikCreateData = Prisma.TahunAkademikUncheckedCreateInput
export type TahunAkademikUpdateData = Prisma.TahunAkademikUncheckedUpdateInput
export type TahunAkademikWhere = Prisma.TahunAkademikWhereInput
export type TahunAkademikFindManyArgs = Prisma.TahunAkademikFindManyArgs

export const tahunAkademikRepository = {
  async findAll(): Promise<TahunAkademik[]> {
    return prisma.tahunAkademik.findMany({
      orderBy: { nama: "desc" },
    })
  },

  async findById(id: number): Promise<TahunAkademik | null> {
    return prisma.tahunAkademik.findUnique({ where: { id } })
  },

  async findActive(): Promise<TahunAkademik | null> {
    return prisma.tahunAkademik.findFirst({ where: { is_active: true } })
  },

  async findFirst(where: TahunAkademikWhere): Promise<TahunAkademik | null> {
    return prisma.tahunAkademik.findFirst({ where })
  },

  async findMany(args: TahunAkademikFindManyArgs): Promise<TahunAkademik[]> {
    return prisma.tahunAkademik.findMany(args)
  },

  async count(where: TahunAkademikWhere): Promise<number> {
    return prisma.tahunAkademik.count({ where })
  },

  async create(data: TahunAkademikCreateData): Promise<TahunAkademik> {
    return prisma.tahunAkademik.create({ data })
  },

  async update(
    id: number,
    data: TahunAkademikUpdateData
  ): Promise<TahunAkademik | null> {
    return prisma.tahunAkademik.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.tahunAkademik.delete({ where: { id } })
  },
}
