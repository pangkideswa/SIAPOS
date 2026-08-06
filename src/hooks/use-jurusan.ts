'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { jurusanService, type JurusanFormData } from '@/lib/services/jurusan.service'

export function useJurusans(filters: { search?: string; is_active?: boolean; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['jurusans', filters],
    queryFn: () => jurusanService.getAll(filters),
  })
}

export function useJurusan(id: number) {
  return useQuery({
    queryKey: ['jurusan', id],
    queryFn: () => jurusanService.getById(id),
    enabled: !!id,
  })
}

export function useCreateJurusan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: JurusanFormData) => jurusanService.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['jurusans'] }) },
  })
}

export function useUpdateJurusan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: JurusanFormData }) =>
      jurusanService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['jurusans'] }) },
  })
}

export function useDeleteJurusan() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => jurusanService.remove(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['jurusans'] }) },
  })
}
