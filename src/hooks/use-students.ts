'use client'

import { createCrudHooks } from '@/hooks/use-api-crud'
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
