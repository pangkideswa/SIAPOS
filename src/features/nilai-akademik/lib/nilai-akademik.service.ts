import { DUMMY_NILAI_AKADEMIK } from "../dummy/nilai-akademik.data"
import type { NilaiAkademik } from "../types/nilai-akademik"

export const nilaiAkademikService = {
  getAll(): NilaiAkademik[] {
    return DUMMY_NILAI_AKADEMIK
  },
}
