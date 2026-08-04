import "server-only"
import { Prisma, type Announcement } from "@/generated/prisma/client"
import { announcementRepository } from "@/repositories/announcement.repository"
import {
  toAnnouncementStatus,
  toAnnouncementStatusDb,
} from "@/lib/db-mappers"
import type { Pengumuman, StatusPengumuman } from "@/features/pengumuman/types/pengumuman"

export type AnnouncementCreateInput = Omit<
  Pengumuman,
  "id" | "created_at" | "updated_at"
>

function toPengumuman(row: Announcement): Pengumuman {
  return {
    id: row.id,
    judul: row.judul,
    ringkasan: row.ringkasan ?? "",
    isi: row.isi ?? "",
    kategori: (row.kategori as Pengumuman["kategori"]) ?? "Informasi Umum",
    target: (row.target as Pengumuman["target"]) ?? "Semua Pengguna",
    kelas: row.kelas ?? undefined,
    status: toAnnouncementStatus(row.status),
    penulis: row.penulis ?? "",
    pinned: row.pinned,
    lampiran: Array.isArray(row.lampiran)
      ? (row.lampiran as unknown as Pengumuman["lampiran"])
      : [],
    tanggal_publish: row.tanggal_publish?.toISOString() ?? "",
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

function toPengumumanCreate(data: AnnouncementCreateInput): Prisma.AnnouncementUncheckedCreateInput {
  return {
    judul: data.judul,
    ringkasan: data.ringkasan || null,
    isi: data.isi || null,
    kategori: data.kategori,
    target: data.target,
    kelas: data.kelas ?? null,
    status: toAnnouncementStatusDb(data.status),
    penulis: data.penulis || null,
    pinned: data.pinned,
    lampiran:
      data.lampiran.length > 0
        ? (data.lampiran as unknown as Prisma.InputJsonValue)
        : undefined,
    tanggal_publish: data.tanggal_publish
      ? new Date(data.tanggal_publish)
      : null,
  }
}

export const announcementService = {
  async getAll(): Promise<Pengumuman[]> {
    const rows = await announcementRepository.findAll()
    return rows.map(toPengumuman)
  },

  async getById(id: number): Promise<Pengumuman | null> {
    const row = await announcementRepository.findById(id)
    return row ? toPengumuman(row) : null
  },

  async create(data: AnnouncementCreateInput): Promise<Pengumuman> {
    const row = await announcementRepository.create(toPengumumanCreate(data))
    return toPengumuman(row)
  },

  async update(
    id: number,
    data: AnnouncementCreateInput
  ): Promise<Pengumuman | null> {
    const row = await announcementRepository.update(id, toPengumumanCreate(data))
    return row ? toPengumuman(row) : null
  },

  async setStatus(
    id: number,
    status: StatusPengumuman
  ): Promise<Pengumuman | null> {
    const row = await announcementRepository.update(id, {
      status: toAnnouncementStatusDb(status),
    })
    return row ? toPengumuman(row) : null
  },

  async togglePinned(id: number): Promise<Pengumuman | null> {
    const current = await announcementRepository.findById(id)
    if (!current) return null
    const row = await announcementRepository.update(id, {
      pinned: !current.pinned,
    })
    return row ? toPengumuman(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await announcementRepository.delete(id)
    return true
  },
}
