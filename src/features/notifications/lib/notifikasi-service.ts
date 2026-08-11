"use client"

import {
  notificationService,
  type PushNotifikasiInput,
} from "@/lib/services/notification.service"
import type { Notifikasi } from "@/features/notifications/types/notifikasi"

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

let cache: Notifikasi[] = []

export async function getNotifikasi(): Promise<Notifikasi[]> {
  cache = await notificationService.getAll()
  return cache
}

export function pushNotifikasi(input: PushNotifikasiInput): Promise<Notifikasi> {
  return notificationService.create(input).then((notification) => {
    cache = [notification, ...cache]
    emit()
    return notification
  })
}

export async function markNotifikasiRead(id: number) {
  try {
    await notificationService.markRead(id)
    cache = cache.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    emit()
  } catch {
    // server unavailable: keep local state as-is
  }
}

export async function markAllNotifikasiRead() {
  try {
    await notificationService.markAllRead()
    cache = cache.map((n) => ({ ...n, is_read: true }))
    emit()
  } catch {
    // server unavailable: keep local state as-is
  }
}

export async function markNotifikasiListRead(ids: number[]) {
  try {
    await notificationService.markListRead(ids)
    const idSet = new Set(ids)
    cache = cache.map((n) => (idSet.has(n.id) ? { ...n, is_read: true } : n))
    emit()
  } catch {
    // server unavailable: keep local state as-is
  }
}
