'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { teacherSubjectService } from '@/lib/services/teacher-subject.service'

export function useTeacherSubjects(filters: { teacher_id?: number; subject_id?: number; class_id?: number; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['teacher-subjects', filters],
    queryFn: () => teacherSubjectService.getAll(filters),
  })
}

export function useCreateTeacherSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: teacherSubjectService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['teacher-subjects'] }) },
  })
}

export function useDeleteTeacherSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => teacherSubjectService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['teacher-subjects'] }) },
  })
}
