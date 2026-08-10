"use client"

import React, { createContext, useContext, useEffect, useState } from "react"
import { apiFetch } from "@/lib/client-api"
import type { SekolahFormData } from "@/features/pengaturan-sekolah/types/pengaturan-sekolah"
import { DUMMY_SEKOLAH_SETTINGS } from "@/features/pengaturan-sekolah/dummy/pengaturan-sekolah.data"

type SettingsContextType = {
  settings: SekolahFormData
  isLoading: boolean
  refreshSettings: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children, initialSettings }: { children: React.ReactNode, initialSettings?: Partial<SekolahFormData> }) {
  // Merge initial with dummy default to prevent structural errors
  const defaultSettings = { ...structuredClone(DUMMY_SEKOLAH_SETTINGS), ...initialSettings }
  const [settings, setSettings] = useState<SekolahFormData>(defaultSettings as SekolahFormData)
  const [isLoading, setIsLoading] = useState(true)

  const refreshSettings = async () => {
    try {
      const data = await apiFetch<Partial<SekolahFormData>>("/api/settings")
      if (data && Object.keys(data).length > 0) {
        setSettings((prev) => ({
          ...prev,
          ...data,
        }))
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    // Only fetch if client side, initialSettings would be provided by layout if SSR
    if (!initialSettings) {
      refreshSettings()
    } else {
      setIsLoading(false)
    }
  }, [initialSettings])

  return (
    <SettingsContext.Provider value={{ settings, isLoading, refreshSettings }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
