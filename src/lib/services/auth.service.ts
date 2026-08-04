import { apiFetch } from '@/lib/client-api'
import type { AuthResponse, User } from '@/types'

export const authService = {
  login: async (identifier: string, password: string) => {
    return apiFetch<AuthResponse>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    })
  },
  register: async (data: {
    name: string
    email: string
    password: string
    password_confirmation: string
    role?: string
    nip?: string | null
    nisn?: string | null
  }) => {
    return apiFetch<AuthResponse>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
  logout: async () => {
    await apiFetch<null>('/api/auth/logout', {
      method: 'POST',
    })
  },
  getUser: async () => {
    return apiFetch<User>('/api/auth/user')
  },
}
