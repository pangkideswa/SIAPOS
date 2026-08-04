'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  penilaianService,
  type PenilaianUpdateData,
} from '@/lib/services/penilaian.service'
import { getErrorMessage } from '@/hooks/use-api-crud'
import type { Penilaian } from '@/features/penilaian/types/penilaian'

export function usePenilaian() {
  return useQuery<Penilaian[]>({
    queryKey: ['penilaian'],
    queryFn: () => penilaianService.getAll(),
  })
}

export function usePenilaianDetail(id: number) {
  return useQuery<Penilaian>({
    queryKey: ['penilaian', id],
    queryFn: () => penilaianService.getById(id),
    enabled: !!id,
  })
}

export function useUpdatePenilaian() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PenilaianUpdateData }) =>
      penilaianService.update(id, data),
    onSuccess: () => {
      toast.success('Penilaian berhasil disimpan')
      queryClient.invalidateQueries({ queryKey: ['penilaian'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}
