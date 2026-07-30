'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { subjectService } from '@/lib/services/subject.service'

export function useSubjects(filters: { search?: string; is_active?: boolean; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['subjects', filters],
    queryFn: () => subjectService.getAll(filters),
  })
}

export function useSubject(id: number) {
  return useQuery({
    queryKey: ['subject', id],
    queryFn: () => subjectService.getById(id),
    enabled: !!id,
  })
}

export function useCreateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: subjectService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subjects'] }) },
  })
}

export function useUpdateSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => subjectService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subjects'] }) },
  })
}

export function useDeleteSubject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => subjectService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['subjects'] }) },
  })
}
