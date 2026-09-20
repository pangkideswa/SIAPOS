import { prisma } from "@/lib/prisma"
import type { BankSoalStatus } from "@/generated/prisma/enums"

export type PaketSoalCreateInput = {
  kode_paket: string
  judul: string
  deskripsi?: string
  mata_pelajaran: string
  durasi_menit: number
  status?: BankSoalStatus
  guru_id?: number
  items?: {
    bank_soal_id: number
    bobot: number
    nomor_urut: number
  }[]
}

export type PaketSoalUpdateInput = Partial<PaketSoalCreateInput>

export const paketSoalService = {
  async getAll(guruId?: number) {
    return await prisma.paketSoal.findMany({
      where: guruId ? { guru_id: guruId } : undefined,
      include: {
        _count: {
          select: { items: true }
        },
        guru: {
          select: { nama_lengkap: true }
        }
      },
      orderBy: { created_at: "desc" },
    })
  },

  async getById(id: number) {
    return await prisma.paketSoal.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            bank_soal: true
          },
          orderBy: { nomor_urut: "asc" }
        },
        guru: {
          select: { nama_lengkap: true }
        }
      },
    })
  },

  async create(data: PaketSoalCreateInput) {
    return await prisma.paketSoal.create({
      data: {
        kode_paket: data.kode_paket,
        judul: data.judul,
        deskripsi: data.deskripsi,
        mata_pelajaran: data.mata_pelajaran,
        durasi_menit: data.durasi_menit,
        status: data.status ?? "DRAFT",
        guru_id: data.guru_id,
        items: data.items ? {
          create: data.items,
        } : undefined,
      },
      include: {
        items: true,
      }
    })
  },

  async update(id: number, data: PaketSoalUpdateInput) {
    return await prisma.$transaction(async (tx) => {
      if (data.items) {
        await tx.paketSoalItem.deleteMany({
          where: { paket_soal_id: id }
        });
      }

      return await tx.paketSoal.update({
        where: { id },
        data: {
          kode_paket: data.kode_paket,
          judul: data.judul,
          deskripsi: data.deskripsi,
          mata_pelajaran: data.mata_pelajaran,
          durasi_menit: data.durasi_menit,
          status: data.status,
          guru_id: data.guru_id,
          items: data.items ? {
            create: data.items,
          } : undefined,
        },
        include: {
          items: true,
        }
      })
    })
  },

  async delete(id: number) {
    return await prisma.paketSoal.delete({
      where: { id },
    })
  },
}
