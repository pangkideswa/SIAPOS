'use client'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { userService } from '@/lib/services/user.service'

export function useUsers(filters: { role?: string; search?: string; page?: number; per_page?: number } = {}) {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getAll(filters),
  })
}

export function useUser(id: number) {
  return useQuery({
    queryKey: ['user', id],
    queryFn: () => userService.getById(id),
    enabled: !!id,
  })
}

export function useCreateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: userService.create,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }) },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Record<string, unknown> }) => userService.update(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }) },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => userService.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['users'] }) },
  })
}
