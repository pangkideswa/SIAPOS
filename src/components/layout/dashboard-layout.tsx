"use client"

import { useAuth } from "@/contexts/auth-context"
import { Sidebar } from "./sidebar"
import { BottomNav } from "./bottom-nav"
import { TopBar } from "./top-bar"
import { motion } from "framer-motion"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useMemo } from "react"
import type { UserRole } from "@/types/auth"

const routeRoleMap: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["super_admin", "admin"] },
  { prefix: "/guru", roles: ["super_admin", "admin", "guru"] },
  { prefix: "/siswa", roles: ["super_admin", "admin", "siswa"] },
  { prefix: "/wali", roles: ["super_admin", "admin", "wali"] },
  { prefix: "/forbidden", roles: ["super_admin", "admin", "guru", "siswa", "wali"] },
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-muted-foreground">Memuat...</p>
        </div>
      </div>
    )
  }

  if (!user) return null

  if (allowedRoles && !hasRole(...allowedRoles)) return null

  return (
    <div className="flex min-h-screen bg-muted/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {children}
          </motion.div>
        </main>
      </div>
      <BottomNav />
    </div>
  )
}
