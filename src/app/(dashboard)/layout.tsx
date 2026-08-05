"use client"

import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { NotifikasiProvider } from "@/features/notifications/contexts/notifikasi-context"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Toaster } from "sonner"
import { Skeleton } from "@/components/ui/skeleton"

function ContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-44" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-72 rounded-xl" />
    </div>
  )
}

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <NotifikasiProvider>
        <DashboardLayout>
          <Suspense fallback={<ContentSkeleton />}>{children}</Suspense>
        </DashboardLayout>
      </NotifikasiProvider>
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  )
}
