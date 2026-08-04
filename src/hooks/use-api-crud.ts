'use client'

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'

export function getErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { message?: string }
    if (e.message) return e.message
  }
  return 'Terjadi kesalahan pada server'
}

interface CrudApi<T, C, U> {
  getAll: () => Promise<T[]>
  getById: (id: number) => Promise<T>
  create: (data: C) => Promise<T>
  update: (id: number, data: U) => Promise<T>
  remove: (id: number) => Promise<unknown>
}

interface CrudMessages {
  create?: string
  update?: string
  remove?: string
}

/**
 * Builds a standard set of react-query hooks (list / detail / create / update /
 * delete) for an API-backed CRUD resource. Mutations apply optimistic updates
 * to the cached list, roll back on failure, show sonner toasts, and finally
 * revalidate the list so the server stays the source of truth.
 */
export function createCrudHooks<
  T extends { id: number },
  C = unknown,
  U = unknown
>(
  listKey: string,
  api: CrudApi<T, C, U>,
  messages?: CrudMessages
) {
  const keys = {
    list: [listKey] as string[],
    detail: (id: number) => [listKey, id] as string[],
  }

  function useList(): UseQueryResult<T[]> {
    return useQuery<T[]>({ queryKey: keys.list, queryFn: api.getAll })
  }

  function useDetail(id: number) {
    return useQuery<T>({
      queryKey: keys.detail(id),
      queryFn: () => api.getById(id),
      enabled: !!id,
    })
  }

  function useCreate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: api.create,
      onMutate: async (newItem: C) => {
        await queryClient.cancelQueries({ queryKey: keys.list })
        const previous = queryClient.getQueryData<T[]>(keys.list)
        const placeholder = {
          id: Date.now(),
          ...(newItem as object),
        } as T
        queryClient.setQueryData<T[]>(keys.list, (old = []) => [
          placeholder,
          ...old,
        ])
        return { previous }
      },
      onError: (err, _variables, context) => {
        if (context?.previous) {
          queryClient.setQueryData(keys.list, context.previous)
        }
        toast.error(getErrorMessage(err))
      },
      onSuccess: () => {
        toast.success(messages?.create ?? 'Data berhasil ditambahkan')
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: keys.list })
      },
    })
  }

  function useUpdate() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: ({ id, data }: { id: number; data: U }) =>
        api.update(id, data),
      onMutate: async ({ id, data }: { id: number; data: U }) => {
        await queryClient.cancelQueries({ queryKey: keys.list })
        const previous = queryClient.getQueryData<T[]>(keys.list)
        queryClient.setQueryData<T[]>(keys.list, (old = []) =>
          old.map((item) =>
            item.id === id
              ? ({ ...item, ...(data as object), id } as T)
              : item
          )
        )
        return { previous }
      },
      onError: (err, _variables, context) => {
        if (context?.previous) {
          queryClient.setQueryData(keys.list, context.previous)
        }
        toast.error(getErrorMessage(err))
      },
      onSuccess: () => {
        toast.success(messages?.update ?? 'Data berhasil diperbarui')
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: keys.list })
      },
    })
  }

  function useRemove() {
    const queryClient = useQueryClient()
    return useMutation({
      mutationFn: api.remove,
      onMutate: async (id: number) => {
        await queryClient.cancelQueries({ queryKey: keys.list })
        const previous = queryClient.getQueryData<T[]>(keys.list)
        queryClient.setQueryData<T[]>(keys.list, (old = []) =>
          old.filter((item) => item.id !== id)
        )
        return { previous }
      },
      onError: (err, _variables, context) => {
        if (context?.previous) {
          queryClient.setQueryData(keys.list, context.previous)
        }
        toast.error(getErrorMessage(err))
      },
      onSuccess: () => {
        toast.success(messages?.remove ?? 'Data berhasil dihapus')
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: keys.list })
      },
    })
  }

  return { useList, useDetail, useCreate, useUpdate, useRemove }
}
