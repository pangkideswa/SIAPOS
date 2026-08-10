import "server-only"
import { type Notifikasi as DbNotifikasi } from "@/generated/prisma/client"
import { notifikasiRepository } from "@/repositories/notifikasi.repository"
import { toNotifikasiTipe, toNotifikasiTipeDb } from "@/lib/db-mappers"
import type {
  Notifikasi,
  NotifikasiTipe,
} from "@/features/notifications/types/notifikasi"

export interface NotifikasiCreateInput {
  user_id: number
  tipe: NotifikasiTipe
  judul: string
  pesan: string
  href?: string
}

export interface NotifikasiCreateManyInput {
  user_ids: number[]
  tipe: NotifikasiTipe
  judul: string
  pesan: string
  href?: string
}

function toNotifikasi(row: DbNotifikasi): Notifikasi {
  return {
    id: row.id,
    tipe: toNotifikasiTipe(row.tipe),
    judul: row.judul,
    pesan: row.pesan,
    href: row.href ?? undefined,
    is_read: row.is_read,
    created_at: row.created_at.toISOString(),
  }
}

export const notifikasiService = {
  async getAllByUserId(userId: number): Promise<Notifikasi[]> {
    const rows = await notifikasiRepository.findAllByUserId(userId)
    return rows.map(toNotifikasi)
  },

  async getAllForSuperAdmin(): Promise<Notifikasi[]> {
    const rows = await notifikasiRepository.findAll()
    return rows.map(toNotifikasi)
  },

  async create(data: NotifikasiCreateInput): Promise<Notifikasi> {
    const row = await notifikasiRepository.create({
      user_id: data.user_id,
      tipe: toNotifikasiTipeDb(data.tipe),
      judul: data.judul,
      pesan: data.pesan,
      href: data.href ?? null,
      targetRoles: [],
      is_read: false,
    })
    return toNotifikasi(row)
  },

  async createForUsers(data: NotifikasiCreateManyInput): Promise<number> {
    if (!data.user_ids.length) return 0
    const tipeDb = toNotifikasiTipeDb(data.tipe)
    const records = data.user_ids.map((uid) => ({
      user_id: uid,
      tipe: tipeDb,
      judul: data.judul,
      pesan: data.pesan,
      href: data.href ?? null,
      targetRoles: [],
      is_read: false,
    }))
    return notifikasiRepository.createMany(records)
  },

  async markRead(id: number, userId: number): Promise<boolean> {
    return notifikasiRepository.markReadOwned(id, userId)
  },

  async markListRead(ids: number[], userId: number): Promise<number> {
    return notifikasiRepository.markListReadOwned(ids, userId)
  },

  async markAllReadByUserId(userId: number): Promise<number> {
    return notifikasiRepository.markAllReadByUserId(userId)
  },
}
