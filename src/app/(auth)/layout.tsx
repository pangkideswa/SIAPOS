"use client"

import { AuthProvider } from "@/contexts/auth-context"
import Link from "next/link"

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
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 text-white font-bold text-xl shadow-lg backdrop-blur-sm">
              SI
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
        <AuthProvider>{children}</AuthProvider>
      </div>
    </div>
  )
}
