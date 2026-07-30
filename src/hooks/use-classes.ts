'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { classService } from '@/lib/services/class.service'

export function useClasses(filters: { search?: string; grade_level?: string; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['classes', filters],
    queryFn: () => classService.getAll(filters),
  })
}

export function useClass(id: number) {
  return useQuery({
    queryKey: ['class', id],
    queryFn: () => classService.getById(id),
    enabled: !!id,
  })
}

export function useCreateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: classService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }) },
  })
}

export function useUpdateClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => classService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }) },
  })
}

export function useDeleteClass() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => classService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['classes'] }) },
  })
}
