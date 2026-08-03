import { DUMMY_TUGAS } from "../dummy/tugas.data"
import type { Tugas, TugasFormData } from "../types/tugas"

export const assignmentService = {
  getAll(): Tugas[] {
    return DUMMY_TUGAS
  },

  getById(id: number): Tugas | undefined {
    return DUMMY_TUGAS.find((t) => t.id === id)
  },

  getByKelasMengajar(kelasMengajarId: number): Tugas[] {
    return DUMMY_TUGAS.filter(
      (t) => t.kelas_mengajar_id === kelasMengajarId
    )
  },

  create(data: TugasFormData): Tugas {
    const now = new Date().toISOString()
    const newItem: Tugas = {
      ...data,
      id: Math.max(...DUMMY_TUGAS.map((t) => t.id), 0) + 1,
      created_at: now,
      updated_at: now,
    }
    DUMMY_TUGAS.push(newItem)
    return newItem
  },

  update(id: number, data: TugasFormData): Tugas | undefined {
    const idx = DUMMY_TUGAS.findIndex((t) => t.id === id)
    if (idx === -1) return undefined
    DUMMY_TUGAS[idx] = {
      ...DUMMY_TUGAS[idx],
      ...data,
      updated_at: new Date().toISOString(),
    }
    return DUMMY_TUGAS[idx]
  },

  remove(id: number): void {
    const idx = DUMMY_TUGAS.findIndex((t) => t.id === id)
    if (idx !== -1) DUMMY_TUGAS.splice(idx, 1)
  },

  setStatus(id: number, status: Tugas["status"]): Tugas | undefined {
    const idx = DUMMY_TUGAS.findIndex((t) => t.id === id)
    if (idx === -1) return undefined
    DUMMY_TUGAS[idx] = {
      ...DUMMY_TUGAS[idx],
      status,
      updated_at: new Date().toISOString(),
    }
    return DUMMY_TUGAS[idx]
  },
}
