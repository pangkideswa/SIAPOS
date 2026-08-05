import "server-only"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export type NilaiCreateData = Prisma.NilaiUncheckedCreateInput
export type NilaiUpdateData = Prisma.NilaiUncheckedUpdateInput
export type NilaiWhere = Prisma.NilaiWhereInput

const NILAI_INCLUDE = {
  student: {
    select: { id: true, nama_lengkap: true, nisn: true, kelas: true },
  },
  teaching_class: {
    select: {
      id: true,
      guru_nama: true,
      mata_pelajaran: true,
      kelas: true,
      semester: true,
    },
  },
} as const

export type NilaiRow = Prisma.NilaiGetPayload<{
  include: typeof NILAI_INCLUDE
}>

export const nilaiRepository = {
  async findAll(): Promise<NilaiRow[]> {
    return prisma.nilai.findMany({
      include: NILAI_INCLUDE,
      orderBy: { created_at: "desc" },
    })
  },

  async findById(id: number): Promise<NilaiRow | null> {
    return prisma.nilai.findUnique({ where: { id }, include: NILAI_INCLUDE })
  },

  async findByStudent(studentId: number): Promise<NilaiRow[]> {
    return prisma.nilai.findMany({
      where: { student_id: studentId },
      include: NILAI_INCLUDE,
      orderBy: { created_at: "desc" },
    })
  },

  async findByTeachingClass(teachingClassId: number): Promise<NilaiRow[]> {
    return prisma.nilai.findMany({
      where: { teaching_class_id: teachingClassId },
      include: NILAI_INCLUDE,
      orderBy: { created_at: "desc" },
    })
  },

  async findMany(where: NilaiWhere): Promise<NilaiRow[]> {
    return prisma.nilai.findMany({
      where,
      include: NILAI_INCLUDE,
      orderBy: { created_at: "desc" },
    })
  },

  async count(where: NilaiWhere): Promise<number> {
    return prisma.nilai.count({ where })
  },

  async create(data: NilaiCreateData): Promise<NilaiRow> {
    return prisma.nilai.create({ data, include: NILAI_INCLUDE })
  },

  async update(
    id: number,
    data: NilaiUpdateData
  ): Promise<NilaiRow | null> {
    return prisma.nilai.update({
      where: { id },
      data,
      include: NILAI_INCLUDE,
    })
  },

  async delete(id: number): Promise<void> {
    await prisma.nilai.delete({ where: { id } })
  },
}
