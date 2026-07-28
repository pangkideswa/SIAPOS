"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  School,
  BookMarked,
  UserCog,
  ClipboardList,
  User,
  Layers,
  BookOpenCheck,
  Award,
  ListChecks,
  FileQuestion,
  Monitor,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import type { UserRole } from "@/types/auth"

interface NavItem {
  label: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: UserRole[]
}

const navItems: NavItem[] = [
  {
    label: "Beranda",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Pengguna",
    href: "/admin/users",
    icon: Users,
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
    label: "Mata Pelajaran",
    href: "/admin/subjects",
    icon: BookMarked,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Penugasan Guru",
    href: "/admin/assignments",
    icon: UserCog,
    roles: ["super_admin", "admin"],
  },
  {
    label: "Kelas Mengajar",
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
    label: "Beranda",
    href: "/guru",
    icon: LayoutDashboard,
    roles: ["guru"],
  },
  {
    label: "Kelas Saya",
    href: "/guru/kelas",
    icon: BookOpen,
    roles: ["guru"],
  },
  {
    label: "Materi Pembelajaran",
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
    label: "Pengumpulan",
    href: "/guru/pengumpulan",
    icon: ClipboardList,
    roles: ["guru"],
  },
  {
    label: "Penilaian",
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
    label: "Simulasi",
    href: "/siswa/simulasi",
    icon: ClipboardList,
    roles: ["siswa"],
  },
  {
    label: "CBT",
    href: "/siswa/cbt",
    icon: Monitor,
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

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  guru: "Guru",
  siswa: "Siswa",
  wali: "Wali Kelas",
}

export function Sidebar() {
  const { logout, hasRole, user } = useAuth()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const filteredNav = navItems.filter((item) => hasRole(...item.roles))

  const userRole = user?.role ?? "admin"
  const roleLabel = roleLabels[userRole] ?? "Admin"

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col h-screen bg-white border-r border-border transition-all duration-300 sticky top-0",
        collapsed ? "w-[68px]" : "w-64"
      )}
    >
      <div className="flex items-center gap-2.5 px-4 h-16 border-b border-border shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white font-bold text-sm shrink-0 shadow-sm shadow-primary/20">
          SI
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-bold text-base tracking-tight leading-tight">
              SIAPOS
            </span>
            <span className="text-[10px] text-muted-foreground font-medium leading-tight">
              {roleLabel}
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {filteredNav.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(item.href + "/")
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 space-y-1">
        <Separator className="mb-2" />
        <Link
          href={`/${userRole === "guru" ? "guru" : userRole === "siswa" ? "siswa" : userRole === "wali" ? "wali" : "admin"}/profil`}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
            "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <User className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Profil</span>}
        </Link>
        <Link
          href={`/${userRole === "guru" ? "guru" : userRole === "siswa" ? "siswa" : userRole === "wali" ? "wali" : "admin"}/pengaturan`}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
            "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <Settings className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Pengaturan</span>}
        </Link>
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors w-full"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Keluar</span>}
        </button>
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-10"
      >
        {collapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </button>
    </aside>
  )
}
