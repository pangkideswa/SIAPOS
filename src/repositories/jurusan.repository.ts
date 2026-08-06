import "server-only"
import { prisma } from "@/lib/prisma"
import type { Jurusan, Prisma } from "@/generated/prisma/client"

export type JurusanCreateData = Prisma.JurusanUncheckedCreateInput
export type JurusanUpdateData = Prisma.JurusanUncheckedUpdateInput
export type JurusanWhere = Prisma.JurusanWhereInput
export type JurusanFindManyArgs = Prisma.JurusanFindManyArgs

export const jurusanRepository = {
  async findAll(): Promise<Jurusan[]> {
    return prisma.jurusan.findMany({
      orderBy: { name: "asc" },
    })
  },

  async findById(id: number): Promise<Jurusan | null> {
    return prisma.jurusan.findUnique({ where: { id } })
  },

  async findFirst(where: JurusanWhere): Promise<Jurusan | null> {
    return prisma.jurusan.findFirst({ where })
  },

  async findMany(args: JurusanFindManyArgs): Promise<Jurusan[]> {
    return prisma.jurusan.findMany(args)
  },

  async count(where: JurusanWhere): Promise<number> {
    return prisma.jurusan.count({ where })
  },

  async create(data: JurusanCreateData): Promise<Jurusan> {
    return prisma.jurusan.create({ data })
  },

  async update(id: number, data: JurusanUpdateData): Promise<Jurusan | null> {
    return prisma.jurusan.update({ where: { id }, data })
  },

  async delete(id: number): Promise<void> {
    await prisma.jurusan.delete({ where: { id } })
  },
}
