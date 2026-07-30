import api from '@/lib/api/axios'
import type { AuthResponse, ApiResponse, User } from '@/types'

export const authService = {
  login: async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', { email, password })
    return response.data
  },
  register: async (data: { name: string; email: string; password: string; password_confirmation: string }) => {
    const response = await api.post<AuthResponse>('/auth/register', data)
    return response.data
  },
  logout: async () => {
    await api.post('/auth/logout')
  },
  getUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/user')
    return response.data
  },
}
