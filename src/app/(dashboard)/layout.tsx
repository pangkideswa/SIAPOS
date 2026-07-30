"use client"

import { AuthProvider } from "@/contexts/auth-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Toaster } from "sonner"

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <DashboardLayout>{children}</DashboardLayout>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  )
}
