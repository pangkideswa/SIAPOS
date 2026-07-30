import api from '@/lib/api/axios'
import type { TeacherSubject, ApiResponse, ApiListResponse } from '@/types'

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
    const response = await api.get<ApiListResponse<TeacherSubject>>(`/teacher-subjects?${params.toString()}`)
    return response.data
  },
  create: async (data: { teacher_id: number; subject_id: number; class_id: number }) => {
    const response = await api.post<ApiResponse<TeacherSubject>>('/teacher-subjects', data)
    return response.data
  },
  delete: async (id: number) => {
    const response = await api.delete<ApiResponse<null>>(`/teacher-subjects/${id}`)
    return response.data
  },
}
