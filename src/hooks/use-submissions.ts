'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { submissionService } from '@/lib/services/submission.service'
import { getErrorMessage } from '@/hooks/use-api-crud'

export function useSubmissions(assignmentId?: number) {
  const keys = assignmentId
    ? (['submissions', assignmentId] as const)
    : (['submissions'] as const)
  return useQuery({
    queryKey: keys,
    queryFn: () => submissionService.getAll(assignmentId),
  })
}

export function useSubmission(id: number) {
  return useQuery({
    queryKey: ['submissions', id],
    queryFn: () => submissionService.getById(id),
    enabled: !!id,
  })
}

export function useCreateSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: submissionService.create,
    onSuccess: () => {
      toast.success('Tugas berhasil dikumpulkan')
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}

export function useGradeSubmission() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({
      id,
      nilai,
      feedback,
    }: {
      id: number
      nilai: number | null
      feedback?: string | null
    }) => submissionService.grade(id, nilai, feedback),
    onSuccess: () => {
      toast.success('Nilai berhasil disimpan')
      queryClient.invalidateQueries({ queryKey: ['submissions'] })
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  })
}
