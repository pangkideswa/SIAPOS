import { DUMMY_GURU } from "../dummy/guru.data"
import type { Guru } from "../types/guru"

export const guruService = {
  getAll(): Guru[] {
    return DUMMY_GURU
  },

  getById(id: number): Guru | undefined {
    return DUMMY_GURU.find((g) => g.id === id)
  },
}
