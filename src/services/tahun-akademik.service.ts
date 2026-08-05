import "server-only"
import { Prisma, type TahunAkademik } from "@/generated/prisma/client"
import { tahunAkademikRepository } from "@/repositories/tahun-akademik.repository"

export interface TahunAkademikDTO {
  id: number
  nama: string
  tanggal_mulai: string | null
  tanggal_selesai: string | null
  is_active: boolean
  keterangan: string | null
  created_at: string
  updated_at: string
}

export type TahunAkademikCreateInput = Omit<
  TahunAkademikDTO,
  "id" | "created_at" | "updated_at"
>

function toTahunAkademik(row: TahunAkademik): TahunAkademikDTO {
  return {
    id: row.id,
    nama: row.nama,
    tanggal_mulai: row.tanggal_mulai?.toISOString() ?? null,
    tanggal_selesai: row.tanggal_selesai?.toISOString() ?? null,
    is_active: row.is_active,
    keterangan: row.keterangan ?? null,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toTahunAkademikCreate(
  data: TahunAkademikCreateInput
): Prisma.TahunAkademikUncheckedCreateInput {
  return {
    nama: data.nama,
    tanggal_mulai: data.tanggal_mulai ? new Date(data.tanggal_mulai) : null,
    tanggal_selesai: data.tanggal_selesai ? new Date(data.tanggal_selesai) : null,
    is_active: data.is_active,
    keterangan: data.keterangan ?? null,
  }
}

export const tahunAkademikService = {
  async getAll(): Promise<TahunAkademikDTO[]> {
    const rows = await tahunAkademikRepository.findAll()
    return rows.map(toTahunAkademik)
  },

  async getActive(): Promise<TahunAkademikDTO | null> {
    const row = await tahunAkademikRepository.findActive()
    return row ? toTahunAkademik(row) : null
  },

  async getById(id: number): Promise<TahunAkademikDTO | null> {
    const row = await tahunAkademikRepository.findById(id)
    return row ? toTahunAkademik(row) : null
  },

  async create(data: TahunAkademikCreateInput): Promise<TahunAkademikDTO> {
    const row = await tahunAkademikRepository.create(toTahunAkademikCreate(data))
    return toTahunAkademik(row)
  },

  async update(
    id: number,
    data: TahunAkademikCreateInput
  ): Promise<TahunAkademikDTO | null> {
    const row = await tahunAkademikRepository.update(id, toTahunAkademikCreate(data))
    return row ? toTahunAkademik(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await tahunAkademikRepository.delete(id)
    return true
  },
}
