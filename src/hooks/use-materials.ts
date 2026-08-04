'use client'

import { createCrudHooks } from '@/hooks/use-api-crud'
import { materialService, type MaterialFormData } from '@/lib/services/material.service'
import type { Materi } from '@/features/materi/types/materi'

export const materialHooks = createCrudHooks<
  Materi,
  MaterialFormData,
  MaterialFormData
>(
  'materials',
  {
    getAll: materialService.getAll,
    getById: materialService.getById,
    create: materialService.create,
    update: (id, data) => materialService.update(id, data),
    remove: materialService.remove,
  },
  {
    create: 'Materi berhasil ditambahkan',
    update: 'Materi berhasil diperbarui',
    remove: 'Materi berhasil dihapus',
  }
)

export const useMaterials = materialHooks.useList
export const useMaterial = materialHooks.useDetail
export const useCreateMaterial = materialHooks.useCreate
export const useUpdateMaterial = materialHooks.useUpdate
export const useRemoveMaterial = materialHooks.useRemove
