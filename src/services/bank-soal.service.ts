import { prisma } from "@/lib/prisma"
import type { BankSoalStatus, QuestionDifficulty, QuestionType } from "@/generated/prisma/enums"

export type BankSoalCreateInput = {
  kode_soal: string
  mata_pelajaran: string
  pertanyaan: string
  tipe_soal?: QuestionType
  kesulitan?: QuestionDifficulty
  status?: BankSoalStatus
  pembahasan?: string
  guru_id?: number
  options?: {
    teks: string
    is_correct: boolean
  }[]
}

export type BankSoalUpdateInput = Partial<BankSoalCreateInput>

export const bankSoalService = {
  async getAll(guruId?: number) {
    return await prisma.bankSoal.findMany({
      where: guruId ? { guru_id: guruId } : undefined,
      include: {
        options: true,
        guru: {
          select: { nama_lengkap: true }
        }
      },
      orderBy: { created_at: "desc" },
    })
  },

  async getById(id: number) {
    return await prisma.bankSoal.findUnique({
      where: { id },
      include: {
        options: true,
        guru: {
          select: { nama_lengkap: true }
        }
      },
    })
  },

  async create(data: BankSoalCreateInput) {
    return await prisma.bankSoal.create({
      data: {
        kode_soal: data.kode_soal,
        mata_pelajaran: data.mata_pelajaran,
        pertanyaan: data.pertanyaan,
        tipe_soal: data.tipe_soal ?? "PILIHAN_GANDA",
        kesulitan: data.kesulitan ?? "SEDANG",
        status: data.status ?? "DRAFT",
        pembahasan: data.pembahasan,
        guru_id: data.guru_id,
        options: data.options ? {
          create: data.options,
        } : undefined,
      },
      include: {
        options: true,
      }
    })
  },

  async update(id: number, data: BankSoalUpdateInput) {
    return await prisma.$transaction(async (tx) => {
      if (data.options) {
        await tx.questionOption.deleteMany({
          where: { bank_soal_id: id }
        });
      }

      return await tx.bankSoal.update({
        where: { id },
        data: {
          kode_soal: data.kode_soal,
          mata_pelajaran: data.mata_pelajaran,
          pertanyaan: data.pertanyaan,
          tipe_soal: data.tipe_soal,
          kesulitan: data.kesulitan,
          status: data.status,
          pembahasan: data.pembahasan,
          guru_id: data.guru_id,
          options: data.options ? {
            create: data.options,
          } : undefined,
        },
        include: {
          options: true,
        }
      })
    })
  },

  async delete(id: number) {
    return await prisma.bankSoal.delete({
      where: { id },
    })
  },

  async bulkDelete(ids: number[]) {
    return await prisma.bankSoal.deleteMany({
      where: {
        id: { in: ids }
      }
    })
  },
}
