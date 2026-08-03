import { DUMMY_SISWA } from "../dummy/siswa.data"
import type { Siswa } from "../types/siswa"

export const siswaService = {
  getAll(): Siswa[] {
    return DUMMY_SISWA
  },

  getById(id: number): Siswa | undefined {
    return DUMMY_SISWA.find((s) => s.id === id)
  },
}
