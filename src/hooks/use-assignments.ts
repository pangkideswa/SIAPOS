'use client'

import { createCrudHooks } from '@/hooks/use-api-crud'
import { assignmentService, type AssignmentFormData } from '@/lib/services/assignment.service'
import type { Tugas } from '@/features/tugas/types/tugas'

export const assignmentHooks = createCrudHooks<
  Tugas,
  AssignmentFormData,
  AssignmentFormData
>(
  'assignments',
  {
    getAll: assignmentService.getAll,
    getById: assignmentService.getById,
    create: assignmentService.create,
    update: (id, data) => assignmentService.update(id, data),
    remove: assignmentService.remove,
  },
  {
    create: 'Tugas berhasil dibuat',
    update: 'Tugas berhasil diperbarui',
    remove: 'Tugas berhasil dihapus',
  }
)

export const useAssignments = assignmentHooks.useList
export const useAssignment = assignmentHooks.useDetail
export const useCreateAssignment = assignmentHooks.useCreate
export const useUpdateAssignment = assignmentHooks.useUpdate
export const useRemoveAssignment = assignmentHooks.useRemove
