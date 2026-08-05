'use client'

import { createCrudHooks } from '@/hooks/use-api-crud'
import {
  nilaiService,
  type NilaiCreateData,
  type NilaiUpdateData,
} from '@/lib/services/nilai.service'
import type { NilaiAkademik } from '@/features/nilai-akademik/types/nilai-akademik'

export const nilaiHooks = createCrudHooks<
  NilaiAkademik,
  NilaiCreateData,
  NilaiUpdateData
>(
  'nilai',
  {
    getAll: nilaiService.getAll,
    getById: nilaiService.getById,
    create: nilaiService.create,
    update: (id, data) => nilaiService.update(id, data),
    remove: nilaiService.remove,
  },
  {
    create: 'Nilai berhasil ditambahkan',
    update: 'Nilai berhasil disimpan',
    remove: 'Nilai berhasil dihapus',
  }
)

export const useNilai = nilaiHooks.useList
export const useNilaiDetail = nilaiHooks.useDetail
export const useCreateNilai = nilaiHooks.useCreate
export const useUpdateNilai = nilaiHooks.useUpdate
export const useRemoveNilai = nilaiHooks.useRemove
