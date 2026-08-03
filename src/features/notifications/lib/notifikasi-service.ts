"use client"

import { DUMMY_NOTIFIKASI } from "@/features/notifications/dummy/notifikasi.data"
import type {
  Notifikasi,
  NotifikasiTipe,
} from "@/features/notifications/types/notifikasi"
import type { UserRole } from "@/types/auth"

type NotifikasiListener = () => void

const listeners = new Set<NotifikasiListener>()

export function subscribeNotifikasi(
  listener: NotifikasiListener
): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function emit() {
  listeners.forEach((listener) => listener())
}

export function getNotifikasi(): Notifikasi[] {
  return DUMMY_NOTIFIKASI
}

export interface PushNotifikasiInput {
  tipe: NotifikasiTipe
  judul: string
  pesan: string
  href?: string
  target_roles: UserRole[]
}

export function pushNotifikasi(input: PushNotifikasiInput): Notifikasi {
  const notif: Notifikasi = {
    id: Date.now(),
    tipe: input.tipe,
    judul: input.judul,
    pesan: input.pesan,
    href: input.href,
    target_roles: input.target_roles,
    is_read: false,
    created_at: new Date().toISOString(),
  }
  DUMMY_NOTIFIKASI.unshift(notif)
  emit()
  return notif
}

export function markNotifikasiRead(id: number) {
  const notif = DUMMY_NOTIFIKASI.find((n) => n.id === id)
  if (notif && !notif.is_read) {
    notif.is_read = true
    emit()
  }
}

export function markAllNotifikasiRead() {
  let changed = false
  DUMMY_NOTIFIKASI.forEach((n) => {
    if (!n.is_read) {
      n.is_read = true
      changed = true
    }
  })
  if (changed) emit()
}

export function markNotifikasiListRead(ids: number[]) {
  const idSet = new Set(ids)
  let changed = false
  DUMMY_NOTIFIKASI.forEach((n) => {
    if (idSet.has(n.id) && !n.is_read) {
      n.is_read = true
      changed = true
    }
  })
  if (changed) emit()
}
