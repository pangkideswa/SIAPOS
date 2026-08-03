import { DUMMY_PENGUMUMAN } from "../dummy/pengumuman.data"
import type {
  Pengumuman,
  StatusPengumuman,
} from "../types/pengumuman"

export const announcementService = {
  getAll(): Pengumuman[] {
    return DUMMY_PENGUMUMAN
  },

  getById(id: number): Pengumuman | undefined {
    return DUMMY_PENGUMUMAN.find((p) => p.id === id)
  },

  create(data: Omit<Pengumuman, "id" | "created_at" | "updated_at">): Pengumuman {
    const now = new Date().toISOString()
    const newItem: Pengumuman = {
      ...data,
      id: Math.max(...DUMMY_PENGUMUMAN.map((p) => p.id), 0) + 1,
      created_at: now,
      updated_at: now,
    }
    DUMMY_PENGUMUMAN.push(newItem)
    return newItem
  },

  update(
    id: number,
    data: Omit<Pengumuman, "id" | "created_at" | "updated_at">
  ): Pengumuman | undefined {
    const idx = DUMMY_PENGUMUMAN.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    DUMMY_PENGUMUMAN[idx] = {
      ...DUMMY_PENGUMUMAN[idx],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return DUMMY_PENGUMUMAN[idx]
  },

  remove(id: number): void {
    const idx = DUMMY_PENGUMUMAN.findIndex((p) => p.id === id)
    if (idx !== -1) DUMMY_PENGUMUMAN.splice(idx, 1)
  },

  setStatus(id: number, status: StatusPengumuman): Pengumuman | undefined {
    const idx = DUMMY_PENGUMUMAN.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    DUMMY_PENGUMUMAN[idx] = {
      ...DUMMY_PENGUMUMAN[idx],
      status,
      updated_at: new Date().toISOString(),
    }
    return DUMMY_PENGUMUMAN[idx]
  },

  togglePinned(id: number): Pengumuman | undefined {
    const idx = DUMMY_PENGUMUMAN.findIndex((p) => p.id === id)
    if (idx === -1) return undefined
    DUMMY_PENGUMUMAN[idx] = {
      ...DUMMY_PENGUMUMAN[idx],
      pinned: !DUMMY_PENGUMUMAN[idx].pinned,
      updated_at: new Date().toISOString(),
    }
    return DUMMY_PENGUMUMAN[idx]
  },
}
