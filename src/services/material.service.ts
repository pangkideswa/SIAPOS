import "server-only"
import { Prisma, type Material } from "@/generated/prisma/client"
import { materialRepository } from "@/repositories/material.repository"
import {
  toMaterialStatus,
  toMaterialStatusDb,
} from "@/lib/db-mappers"
import type { Materi, MateriFormData } from "@/features/materi/types/materi"

function toMateri(row: Material): Materi {
  return {
    id: row.id,
    judul: row.judul,
    deskripsi: row.deskripsi ?? "",
    kelas_mengajar_id: row.teaching_class_id ?? 0,
    guru_nama: row.guru_nama ?? "",
    mata_pelajaran: row.mata_pelajaran ?? "",
    kelas: row.kelas ?? "",
    pertemuan: row.pertemuan,
    jenis_materi: (row.jenis_materi as Materi["jenis_materi"]) ?? "Lainnya",
    thumbnail_url: row.thumbnail_url,
    lampiran: Array.isArray(row.lampiran)
      ? (row.lampiran as unknown as Materi["lampiran"])
      : [],
    video_url: row.video_url,
    link_drive: row.link_drive,
    link_eksternal: row.link_eksternal,
    isi_materi: row.isi_materi ?? "",
    status: toMaterialStatus(row.status),
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toMateriCreate(data: MateriFormData): Prisma.MaterialUncheckedCreateInput {
  return {
    teaching_class_id: data.kelas_mengajar_id || null,
    judul: data.judul,
    deskripsi: data.deskripsi || null,
    guru_nama: data.guru_nama || null,
    mata_pelajaran: data.mata_pelajaran || null,
    kelas: data.kelas || null,
    pertemuan: data.pertemuan,
    jenis_materi: data.jenis_materi,
    thumbnail_url: data.thumbnail_url,
    lampiran:
      data.lampiran.length > 0
        ? (data.lampiran as unknown as Prisma.InputJsonValue)
        : undefined,
    video_url: data.video_url,
    link_drive: data.link_drive,
    link_eksternal: data.link_eksternal,
    isi_materi: data.isi_materi || null,
    status: toMaterialStatusDb(data.status),
  }
}

export const materialService = {
  async getAll(): Promise<Materi[]> {
    const rows = await materialRepository.findAll()
    return rows.map(toMateri)
  },

  async getById(id: number): Promise<Materi | null> {
    const row = await materialRepository.findById(id)
    return row ? toMateri(row) : null
  },

  async getByKelasMengajar(kelasMengajarId: number): Promise<Materi[]> {
    const rows = await materialRepository.findByTeachingClassId(kelasMengajarId)
    return rows.map(toMateri)
  },

  async create(data: MateriFormData): Promise<Materi> {
    const row = await materialRepository.create(toMateriCreate(data))
    return toMateri(row)
  },

  async update(id: number, data: MateriFormData): Promise<Materi | null> {
    const row = await materialRepository.update(id, toMateriCreate(data))
    return row ? toMateri(row) : null
  },

  async setStatus(id: number, status: Materi["status"]): Promise<Materi | null> {
    const row = await materialRepository.update(id, {
      status: toMaterialStatusDb(status),
    })
    return row ? toMateri(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await materialRepository.delete(id)
    return true
  },
}
