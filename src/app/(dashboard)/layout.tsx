"use client"

import { AuthProvider } from "@/contexts/auth-context"
import { NotifikasiProvider } from "@/features/notifications/contexts/notifikasi-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Toaster } from "sonner"

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <NotifikasiProvider>
        <DashboardLayout>{children}</DashboardLayout>
      </NotifikasiProvider>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  )
}
