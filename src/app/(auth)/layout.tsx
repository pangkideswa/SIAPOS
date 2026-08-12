"use client"

import { Suspense } from "react"
import { AuthProvider } from "@/contexts/auth-context"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"

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
    <div className="min-h-screen flex flex-col lg:flex-row">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary to-primary/80 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10 [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-card/20 shadow-lg backdrop-blur-sm overflow-hidden p-1">
              <img src="/favicon.png" alt="Logo SIAPOS" className="w-full h-full object-contain" />
            </div>
            <span className="font-bold text-3xl tracking-tight text-white">
              SIAPOS
            </span>
          </Link>
          <h2 className="text-2xl font-bold text-white mb-3">
            Belajar Lebih Mudah,
          </h2>
          <p className="text-lg text-white/80">
            Berkembang Lebih Cepat
          </p>
          <p className="mt-4 text-sm text-white/60 max-w-xs mx-auto">
            Platform pembelajaran digital untuk SMK Wahana Bakti
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-primary/5 via-white to-orange/5 px-4 py-8 lg:py-0">
        <AuthProvider>
          <Suspense fallback={<AuthSkeleton />}>{children}</Suspense>
        </AuthProvider>
      </div>
    </div>
  )
}
