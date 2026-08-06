import "server-only"
import { type Notifikasi as DbNotifikasi } from "@/generated/prisma/client"
import { notifikasiRepository } from "@/repositories/notifikasi.repository"
import { toNotifikasiTipe, toNotifikasiTipeDb } from "@/lib/db-mappers"
import type {
  Notifikasi,
  NotifikasiTipe,
} from "@/features/notifications/types/notifikasi"
import type { UserRole } from "@/types/auth"

export interface NotifikasiCreateInput {
  tipe: NotifikasiTipe
  judul: string
  pesan: string
  href?: string
  target_roles: UserRole[]
}

function toNotifikasi(row: DbNotifikasi): Notifikasi {
  return {
    id: row.id,
    tipe: toNotifikasiTipe(row.tipe),
    judul: row.judul,
    pesan: row.pesan,
    href: row.href ?? undefined,
    target_roles: row.targetRoles as Notifikasi["target_roles"],
    is_read: row.is_read,
    created_at: row.created_at.toISOString(),
  }
}

export const notifikasiService = {
  async getAll(roles: string[]): Promise<Notifikasi[]> {
    const rows = await notifikasiRepository.findAllByRoles(roles)
    return rows.map(toNotifikasi)
  },

  async getAllForSuperAdmin(): Promise<Notifikasi[]> {
    const rows = await notifikasiRepository.findAll()
    return rows.map(toNotifikasi)
  },

  async create(data: NotifikasiCreateInput): Promise<Notifikasi> {
    const row = await notifikasiRepository.create({
      tipe: toNotifikasiTipeDb(data.tipe),
      judul: data.judul,
      pesan: data.pesan,
      href: data.href ?? null,
      targetRoles: data.target_roles,
      is_read: false,
    })
    return toNotifikasi(row)
  },

  async markRead(id: number): Promise<boolean> {
    const row = await notifikasiRepository.update(id, { is_read: true })
    return row !== null
  },

  async markListRead(ids: number[]): Promise<number> {
    return notifikasiRepository.markListRead(ids)
  },

  async markAllRead(roles: string[]): Promise<number> {
    return notifikasiRepository.markAllReadByRoles(roles)
  },
}
