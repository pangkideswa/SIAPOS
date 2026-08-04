import { apiFetch } from '@/lib/client-api'
import type { TeacherSubject } from '@/types'

interface TeacherSubjectFilters {
  teacher_id?: number
  subject_id?: number
  class_id?: number
  page?: number
  per_page?: number
}

export const teacherSubjectService = {
  getAll: async (filters: TeacherSubjectFilters = {}) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') params.append(key, String(value))
    })
    const list = await apiFetch<TeacherSubject[]>(
      `/api/teacher-subjects?${params.toString()}`
    )
    return {
      data: list,
      meta: {
        current_page: 1,
        last_page: 1,
        per_page: Math.max(1, list.length),
        total: list.length,
      },
    }
  },
  create: async (data: {
    teacher_id: number
    subject_id: number
    class_id: number
  }) => {
    return apiFetch<TeacherSubject>('/api/teacher-subjects', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  delete: async (id: number) => {
    return apiFetch<null>(`/api/teacher-subjects/${id}`, {
      method: 'DELETE',
    })
  },
}
