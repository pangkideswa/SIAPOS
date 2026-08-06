import { apiFetch } from "@/lib/client-api"
import type {
  Notifikasi,
  NotifikasiTipe,
} from "@/features/notifications/types/notifikasi"
import type { UserRole } from "@/types/auth"

export interface PushNotifikasiInput {
  tipe: NotifikasiTipe
  judul: string
  pesan: string
  href?: string
  target_roles: UserRole[]
}

export const notificationService = {
  getAll: async () => {
    return apiFetch<Notifikasi[]>("/api/notifications")
  },
  create: async (input: PushNotifikasiInput) => {
    return apiFetch<Notifikasi>("/api/notifications", {
      method: "POST",
      body: JSON.stringify(input),
    })
  },
  markRead: async (id: number) => {
    return apiFetch<boolean>(`/api/notifications/${id}`, { method: "PATCH" })
  },
  markListRead: async (ids: number[]) => {
    return apiFetch<boolean>("/api/notifications/read-all", {
      method: "PATCH",
      body: JSON.stringify({ ids }),
    })
  },
  markAllRead: async () => {
    return apiFetch<boolean>("/api/notifications/read-all", {
      method: "PATCH",
      body: JSON.stringify({}),
    })
  },
}
