"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { ShieldX, ArrowLeft } from "lucide-react"
import { motion } from "framer-motion"
import type { UserRole } from "@/types/auth"

function getDashboardPath(role: UserRole): string {
  switch (role) {
    case "super_admin":
    case "admin":
      return "/admin"
    case "guru":
      return "/guru"
    case "siswa":
      return "/siswa"
    case "wali":
      return "/wali"
    default:
      return "/masuk"
  }
}

export default function ForbiddenPage() {
  const { user, logout } = useAuth()
  const dashboardPath = user ? getDashboardPath(user.role) : "/masuk"

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="text-center max-w-md"
      >
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-2xl bg-destructive/10 flex items-center justify-center">
            <ShieldX className="h-10 w-10 text-destructive" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-foreground mb-2">
          Akses Ditolak
        </h1>
        <p className="text-muted-foreground mb-6">
          Anda tidak memiliki izin untuk mengakses halaman ini. Hubungi administrator jika Anda membutuhkan akses.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href={dashboardPath}>
            <Button variant="outline" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Button
            variant="destructive"
            onClick={() => logout()}
            className="w-full sm:w-auto"
          >
            Keluar
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
