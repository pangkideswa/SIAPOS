import { DUMMY_MATERI } from "../dummy/materi.data"
import type { Materi, MateriFormData } from "../types/materi"

export const materialService = {
  getAll(): Materi[] {
    return DUMMY_MATERI
  },

  getById(id: number): Materi | undefined {
    return DUMMY_MATERI.find((m) => m.id === id)
  },

  getByKelasMengajar(kelasMengajarId: number): Materi[] {
    return DUMMY_MATERI.filter(
      (m) => m.kelas_mengajar_id === kelasMengajarId
    )
  },

  create(data: MateriFormData): Materi {
    const now = new Date().toISOString()
    const newItem: Materi = {
      ...data,
      id: Math.max(...DUMMY_MATERI.map((m) => m.id), 0) + 1,
      created_at: now,
      updated_at: now,
    }
    DUMMY_MATERI.push(newItem)
    return newItem
  },

  update(id: number, data: MateriFormData): Materi | undefined {
    const idx = DUMMY_MATERI.findIndex((m) => m.id === id)
    if (idx === -1) return undefined
    DUMMY_MATERI[idx] = {
      ...DUMMY_MATERI[idx],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return DUMMY_MATERI[idx]
  },

  remove(id: number): void {
    const idx = DUMMY_MATERI.findIndex((m) => m.id === id)
    if (idx !== -1) DUMMY_MATERI.splice(idx, 1)
  },

  setStatus(id: number, status: Materi["status"]): Materi | undefined {
    const idx = DUMMY_MATERI.findIndex((m) => m.id === id)
    if (idx === -1) return undefined
    DUMMY_MATERI[idx] = {
      ...DUMMY_MATERI[idx],
      status,
      updated_at: new Date().toISOString(),
    }
    return DUMMY_MATERI[idx]
  },
}
