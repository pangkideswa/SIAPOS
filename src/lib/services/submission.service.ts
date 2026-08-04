import { apiFetch } from '@/lib/client-api'
import type { PengumpulanTugas } from '@/features/pengumpulan/types/pengumpulan'

export interface SubmissionCreateData {
  assignment_id: number
  student_id: number
  data: {
    file_jawaban?: Record<string, unknown> | null
    catatan?: string | null
  }
}

export const submissionService = {
  getAll: async (assignmentId?: number) => {
    const query = assignmentId ? `?assignment_id=${assignmentId}` : ''
    return apiFetch<PengumpulanTugas[]>(`/api/submissions${query}`)
  },
  getById: async (id: number) => {
    return apiFetch<PengumpulanTugas>(`/api/submissions/${id}`)
  },
  create: async (data: SubmissionCreateData) => {
    return apiFetch<PengumpulanTugas>('/api/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  grade: async (id: number, nilai: number | null, feedback?: string | null) => {
    return apiFetch<PengumpulanTugas>(`/api/submissions/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ nilai, feedback }),
    })
  },
  remove: async (id: number) => {
    return apiFetch<null>(`/api/submissions/${id}`, {
      method: 'DELETE',
    })
  },
}
