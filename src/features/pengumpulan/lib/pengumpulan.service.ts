import { DUMMY_PENGUMPULAN } from "../dummy/pengumpulan.data"
import type { PengumpulanTugas } from "../types/pengumpulan"

export const pengumpulanService = {
  getAll(): PengumpulanTugas[] {
    return DUMMY_PENGUMPULAN
  },
}
