'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  tahunAkademikService,
  type TahunAkademikFormData,
} from '@/lib/services/tahun-akademik.service'

export function useTahunAkademikList(filters: {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
} = {}) {
  return useQuery({
    queryKey: ['tahun-akademik', filters],
    queryFn: () => tahunAkademikService.getAllPaginated(filters),
  })
}

export function useTahunAkademik(id: number) {
  return useQuery({
    queryKey: ['tahun-akademik', id],
    queryFn: () => tahunAkademikService.getById(id),
    enabled: !!id,
  })
}

export function useCreateTahunAkademik() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (data: TahunAkademikFormData) =>
      tahunAkademikService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tahun-akademik'] })
    },
  })
}

export function useUpdateTahunAkademik() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: TahunAkademikFormData }) =>
      tahunAkademikService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tahun-akademik'] })
    },
  })
}

export function useDeleteTahunAkademik() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => tahunAkademikService.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tahun-akademik'] })
    },
  })
}
