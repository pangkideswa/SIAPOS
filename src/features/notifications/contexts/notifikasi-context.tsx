"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"
import {
  getNotifikasi,
  markAllNotifikasiRead,
  markNotifikasiListRead,
  markNotifikasiRead,
  subscribeNotifikasi,
} from "@/features/notifications/lib/notifikasi-service"
import type { Notifikasi } from "@/features/notifications/types/notifikasi"

interface NotifikasiContextType {
  notifications: Notifikasi[]
  unreadCount: number
  isLoading: boolean
  isError: boolean
  markRead: (id: number) => void
  markAllRead: () => void
  markListRead: (ids: number[]) => void
}

const NotifikasiContext = createContext<NotifikasiContextType | null>(null)

export function NotifikasiProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notifikasi[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    const sync = async () => {
      try {
        setIsError(false)
        const list = await getNotifikasi()
        setNotifications(list)
      } catch {
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    }
    sync()
    return subscribeNotifikasi(sync)
  }, [])

  const unreadCount = notifications.filter((n) => !n.is_read).length

  const markRead = useCallback((id: number) => markNotifikasiRead(id), [])
  const markAllRead = useCallback(() => markAllNotifikasiRead(), [])
  const markListRead = useCallback((ids: number[]) => markNotifikasiListRead(ids), [])

  return (
    <NotifikasiContext.Provider
      value={{ notifications, unreadCount, isLoading, isError, markRead, markAllRead, markListRead }}
    >
      {children}
    </NotifikasiContext.Provider>
  )
}

export function useNotifikasi() {
  const context = useContext(NotifikasiContext)
  if (!context) {
    throw new Error("useNotifikasi harus digunakan dalam NotifikasiProvider")
  }
  return context
}
