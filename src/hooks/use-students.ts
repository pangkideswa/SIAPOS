'use client'

import { createCrudHooks } from '@/hooks/use-api-crud'
import { useQuery } from '@tanstack/react-query'
import { studentService, type StudentFormData } from '@/lib/services/student.service'
import type { Siswa } from '@/features/siswa/types/siswa'

export const studentHooks = createCrudHooks<
  Siswa,
  StudentFormData,
  StudentFormData
>(
  'students',
  {
    getAll: studentService.getAll,
    getById: studentService.getById,
    create: studentService.create,
    update: (id, data) => studentService.update(id, data),
    remove: studentService.remove,
  },
  {
    create: 'Siswa berhasil ditambahkan',
    update: 'Siswa berhasil diperbarui',
    remove: 'Siswa berhasil dihapus',
  }
)

export const useStudents = studentHooks.useList
export const useStudent = studentHooks.useDetail
export const useCreateStudent = studentHooks.useCreate
export const useUpdateStudent = studentHooks.useUpdate
export const useRemoveStudent = studentHooks.useRemove

export function useStudentsPaginated(filters: {
  search?: string
  jurusan_id?: number
  kelas?: string
  status?: string
  page?: number
  per_page?: number
} = {}) {
  return useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentService.getAllPaginated(filters),
  })
}
