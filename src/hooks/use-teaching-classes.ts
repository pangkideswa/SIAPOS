'use client'

import { createCrudHooks } from '@/hooks/use-api-crud'
import { teachingClassService, type TeachingClassFormData } from '@/lib/services/teaching-class.service'
import type { KelasMengajar } from '@/features/kelas-mengajar/types/kelas-mengajar'

export const teachingClassHooks = createCrudHooks<
  KelasMengajar,
  TeachingClassFormData,
  TeachingClassFormData
>(
  'teaching-classes',
  {
    getAll: teachingClassService.getAll,
    getById: teachingClassService.getById,
    create: teachingClassService.create,
    update: (id, data) => teachingClassService.update(id, data),
    remove: teachingClassService.remove,
  },
  {
    create: 'Kelas mengajar berhasil ditambahkan',
    update: 'Kelas mengajar berhasil diperbarui',
    remove: 'Kelas mengajar berhasil dihapus',
  }
)

export const useTeachingClasses = teachingClassHooks.useList
export const useTeachingClass = teachingClassHooks.useDetail
export const useCreateTeachingClass = teachingClassHooks.useCreate
export const useUpdateTeachingClass = teachingClassHooks.useUpdate
export const useRemoveTeachingClass = teachingClassHooks.useRemove
