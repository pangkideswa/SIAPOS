"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  User,
  Users,
  School,
  BookMarked,
  ClipboardList,
  Layers,
  BookOpenCheck,
  Award,
  UserCog,
  ListChecks,
  FileQuestion,
  Monitor,
  ClipboardCheck,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import type { UserRole } from "@/types/auth"

interface BottomNavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const bottomNavItems: BottomNavItem[] = [
  {
    label: "Beranda",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Pengguna",
    href: "/admin/users",
    icon: User,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Jurusan",
    href: "/admin/jurusan",
    icon: Layers,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Guru",
    href: "/admin/guru",
    icon: GraduationCap,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Siswa",
    href: "/admin/siswa",
    icon: Users,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Kelas",
    href: "/admin/classes",
    icon: School,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Mapel",
    href: "/admin/subjects",
    icon: BookMarked,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Penugasan",
    href: "/admin/assignments",
    icon: UserCog,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Kls Mengajar",
    href: "/admin/kelas-mengajar",
    icon: BookOpenCheck,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Bank Soal",
    href: "/admin/bank-soal",
    icon: ListChecks,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Paket Soal",
    href: "/admin/paket-soal",
    icon: ClipboardList,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Quiz",
    href: "/guru/quiz",
    icon: FileQuestion,
    roles: ["super_admin", "admin", "guru"],
  },
  {
    label: "CBT",
    href: "/guru/cbt",
    icon: Monitor,
    roles: ["super_admin", "admin", "guru"],
  },
  {
    label: "Hasil Ujian",
    href: "/guru/hasil-ujian",
    icon: ClipboardCheck,
    roles: ["super_admin", "admin", "guru"],
  },
  {
    label: "Analitik",
    href: "/guru/analitik",
    icon: BarChart3,
    roles: ["super_admin", "admin", "guru"],
  },
  {
    label: "Beranda",
    href: "/guru",
    icon: LayoutDashboard,
    roles: ["guru"],
  },
  {
    label: "Kelas",
    href: "/guru/kelas",
    icon: BookOpen,
    roles: ["guru"],
  },
  {
    label: "Materi",
    href: "/guru/materi",
    icon: BookMarked,
    roles: ["guru"],
  },
  {
    label: "Tugas",
    href: "/guru/tugas",
    icon: ClipboardList,
    roles: ["guru"],
  },
  {
    label: "Kumpul",
    href: "/guru/pengumpulan",
    icon: ClipboardList,
    roles: ["guru"],
  },
  {
    label: "Nilai",
    href: "/guru/penilaian",
    icon: Award,
    roles: ["guru"],
  },
  {
    label: "Beranda",
    href: "/siswa",
    icon: LayoutDashboard,
    roles: ["siswa"],
  },
  {
    label: "Pelajaran",
    href: "/siswa/pelajaran",
    icon: GraduationCap,
    roles: ["siswa"],
  },
  {
    label: "Tugas",
    href: "/siswa/tugas",
    icon: ClipboardList,
    roles: ["siswa"],
  },
  {
    label: "Quiz",
    href: "/siswa/quiz",
    icon: FileQuestion,
    roles: ["siswa"],
  },
  {
    label: "CBT",
    href: "/siswa/cbt",
    icon: Monitor,
    roles: ["siswa"],
  },
  {
    label: "Hasil",
    href: "/siswa/hasil-ujian",
    icon: ClipboardCheck,
    roles: ["siswa"],
  },
  {
    label: "Simulasi",
    href: "/siswa/simulasi",
    icon: ClipboardList,
    roles: ["siswa"],
  },
  {
    label: "Beranda",
    href: "/wali",
    icon: LayoutDashboard,
    roles: ["wali"],
  },
  {
    label: "Siswa",
    href: "/wali/siswa",
    icon: Users,
    roles: ["wali"],
  },
  {
    label: "Laporan",
    href: "/wali/laporan",
    icon: BookOpen,
    roles: ["wali"],
  },
]

export function BottomNav() {
  const { hasRole } = useAuth()
  const pathname = usePathname()

  const filteredNav = bottomNavItems.filter((item) => hasRole(...item.roles))

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-border z-50 safe-area-pb">
      <div className="flex items-center justify-around h-16 px-1">
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg text-[10px] font-medium transition-all duration-200 min-w-[56px]",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              <div className="relative">
                <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
