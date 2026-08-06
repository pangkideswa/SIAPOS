'use client'

import { createCrudHooks } from '@/hooks/use-api-crud'
import { useQuery } from '@tanstack/react-query'
import { teacherService, type TeacherFormData } from '@/lib/services/teacher.service'
import type { Guru } from '@/features/guru/types/guru'

export const teacherHooks = createCrudHooks<
  Guru,
  TeacherFormData,
  TeacherFormData
>(
  'teachers',
  {
    getAll: teacherService.getAll,
    getById: teacherService.getById,
    create: teacherService.create,
    update: (id, data) => teacherService.update(id, data),
    remove: teacherService.remove,
  },
  {
    create: 'Guru berhasil ditambahkan',
    update: 'Guru berhasil diperbarui',
    remove: 'Guru berhasil dihapus',
  }
)

export const useTeachers = teacherHooks.useList
export const useTeacher = teacherHooks.useDetail
export const useCreateTeacher = teacherHooks.useCreate
export const useUpdateTeacher = teacherHooks.useUpdate
export const useRemoveTeacher = teacherHooks.useRemove

export function useTeachersPaginated(filters: {
  search?: string
  status_kepegawaian?: string
  jenis_kelamin?: string
  page?: number
  per_page?: number
} = {}) {
  return useQuery({
    queryKey: ['teachers', filters],
    queryFn: () => teacherService.getAllPaginated(filters),
  })
}
