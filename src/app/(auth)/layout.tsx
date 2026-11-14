"use client"

import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import { Skeleton } from "@/components/ui/skeleton"
import { AuthVisualShowcase } from "@/components/auth/auth-visual-showcase"

function AuthSkeleton() {
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2.5 mb-6">
          <Skeleton className="w-10 h-10 rounded-xl" />
          <Skeleton className="h-8 w-28" />
        </div>
        <Skeleton className="h-7 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="rounded-2xl border border-border/60 bg-card p-6 sm:p-8 space-y-4">
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
        <Skeleton className="h-11 w-full rounded-lg" />
      </div>
    </div>
  )
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row relative overflow-hidden bg-background">
      {/* 1. Left Dynamic Visual Showcase (Desktop/Tablet) */}
      <div className="hidden lg:flex lg:w-1/2 relative min-h-screen">
        <AuthVisualShowcase />
      </div>

      {/* 2. Right Column: Form Container with Dynamic Ambient Glow & Dot Matrix */}
      <div className="flex-1 flex items-center justify-center relative p-4 sm:p-8 lg:p-12 overflow-hidden min-h-screen">
        {/* Subtle Ambient Aurora Glow on the Right Side */}
        <div className="absolute -top-28 -right-28 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-28 -left-28 w-80 h-80 bg-orange/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#00000008_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        <div className="relative z-10 w-full max-w-md py-6">
          <AuthProvider>
            <Suspense fallback={<AuthSkeleton />}>{children}</Suspense>
          </AuthProvider>
        </div>
      </div>
    </div>
  )
}
