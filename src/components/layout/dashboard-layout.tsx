"use client"

import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { TopBar } from "./top-bar"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { UserRole } from "@/types/auth"

const routeRoleMap: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["super_admin", "admin"] },
  { prefix: "/guru", roles: ["super_admin", "admin", "guru"] },
  { prefix: "/siswa", roles: ["super_admin", "admin", "siswa"] },
  { prefix: "/forbidden", roles: ["super_admin", "admin", "guru", "siswa"] },
]

function getAllowedRoles(pathname: string): UserRole[] | null {
  for (const route of routeRoleMap) {
    if (pathname === route.prefix || pathname.startsWith(route.prefix + "/")) {
      return route.roles
    }
  }
  return null
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading, hasRole } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const allowedRoles = useMemo(() => getAllowedRoles(pathname), [pathname])

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.push("/masuk")
      return
    }

    if (allowedRoles && !hasRole(...allowedRoles)) {
      router.push("/forbidden")
    }
  }, [isLoading, user, allowedRoles, hasRole, router])

  useEffect(() => {
    setSidebarOpen(false)
  }, [pathname])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background relative overflow-hidden select-none">
        {/* Subtle Ambient Background Canvas */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:24px_24px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        </div>

        <div className="relative z-10 flex flex-col items-center gap-4">
          {/* Orbital Spinner with Centered Logo */}
          <div className="relative flex items-center justify-center w-24 h-24">
            {/* Outer static subtle track ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-primary/15" />

            {/* Outer active rotating ring with SIAPOS primary theme */}
            <div
              className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary animate-spin"
              style={{ animationDuration: "0.95s" }}
            />

            {/* Subtle soft pulsing inner aura */}
            <div className="absolute inset-2 rounded-full bg-primary/5 animate-pulse" />

            {/* Centered SIAPOS Logo */}
            <div className="relative flex items-center justify-center w-12 h-12 rounded-2xl bg-card border border-primary/25 shadow-md p-2 overflow-hidden">
              <img src="/favicon.png" alt="Logo SIAPOS" className="w-full h-full object-contain" />
            </div>
          </div>

          {/* Elegant Loading Label */}
          <div className="flex flex-col items-center gap-1 text-center">
            <p className="text-xs font-bold text-foreground tracking-wider uppercase">
              Memuat SIAPOS
            </p>
            <p className="text-[11px] text-muted-foreground font-medium">
              Menyiapkan portal pembelajaran...
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (allowedRoles && !hasRole(...allowedRoles)) return null

  return (
    <div className="flex min-h-screen relative overflow-hidden bg-background">
      {/* Dynamic Ambient Background Canvas */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Subtle Tech Dot Matrix */}
        <div className="absolute inset-0 bg-[radial-gradient(#80808012_1px,transparent_1px)] [background-size:24px_24px]" />

        {/* Soft Dynamic Ambient Glowing Aurora Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.12, 0.22, 0.12],
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-[15%] -left-[10%] w-[500px] h-[500px] rounded-full bg-primary/20 blur-[130px]"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.08, 0.16, 0.08],
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute -bottom-[15%] -right-[10%] w-[500px] h-[500px] rounded-full bg-orange/15 blur-[140px]"
        />
      </div>

      <Sidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
      
      <div className="flex-1 flex flex-col min-h-screen min-w-0 z-10">
        <TopBar onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 flex flex-col">
          <div className="flex-1">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </div>
          
          <footer className="mt-8 pt-6 border-t border-border/60 shrink-0">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground text-center sm:text-left">
              <p className="font-medium">
                &copy; {new Date().getFullYear()} <strong>SIAPOS v2.0</strong> — Sistem Integrasi Akademik dan Pembelajaran Online Sekolah.
              </p>
              <p className="text-[11px] text-muted-foreground/80">
                Hak Cipta Dilindungi
              </p>
            </div>
          </footer>
        </main>
      </div>
    </div>
  )
}
