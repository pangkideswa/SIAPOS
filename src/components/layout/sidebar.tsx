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
  ClipboardCheck,
  BarChart3,
  CalendarCheck,
  Calendar,
  CalendarDays,
  Megaphone,
  FileSpreadsheet,
  Send,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { Separator } from "@/components/ui/separator"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { UserRole } from "@/types/auth"

type NavEntry =
  | { type: "item"; label: string; href: string; icon: React.ComponentType<{ className?: string }>; roles: UserRole[] }
  | { type: "label"; label: string }

const navItems: NavEntry[] = [
  { type: "item", label: "Beranda", href: "/admin", icon: LayoutDashboard, roles: ["super_admin", "admin"] },
  { type: "item", label: "Pengguna", href: "/admin/users", icon: Users, roles: ["super_admin", "admin"] },
  { type: "item", label: "Jurusan", href: "/admin/jurusan", icon: Layers, roles: ["super_admin", "admin"] },
  { type: "item", label: "Guru", href: "/admin/guru", icon: GraduationCap, roles: ["super_admin", "admin"] },
  { type: "item", label: "Siswa", href: "/admin/siswa", icon: Users, roles: ["super_admin", "admin"] },
  { type: "item", label: "Kelas", href: "/admin/classes", icon: School, roles: ["super_admin", "admin"] },
  { type: "item", label: "Mata Pelajaran", href: "/admin/subjects", icon: BookMarked, roles: ["super_admin", "admin"] },
  { type: "item", label: "Penugasan Guru", href: "/admin/assignments", icon: UserCog, roles: ["super_admin", "admin"] },
  { type: "item", label: "Kelas Mengajar", href: "/admin/kelas-mengajar", icon: BookOpenCheck, roles: ["super_admin", "admin"] },
  { type: "item", label: "Bank Soal", href: "/admin/bank-soal", icon: ListChecks, roles: ["super_admin", "admin"] },
  { type: "item", label: "Paket Soal", href: "/admin/paket-soal", icon: ClipboardList, roles: ["super_admin", "admin"] },
  { type: "label", label: "Academic" },
  { type: "item", label: "Jadwal Pelajaran", href: "/admin/jadwal-pelajaran", icon: Calendar, roles: ["super_admin", "admin"] },
  { type: "item", label: "Absensi", href: "/admin/absensi", icon: CalendarCheck, roles: ["super_admin", "admin"] },
  { type: "item", label: "Kalender Akademik", href: "/admin/kalender-akademik", icon: CalendarDays, roles: ["super_admin", "admin"] },
  { type: "item", label: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone, roles: ["super_admin", "admin"] },
  { type: "item", label: "Nilai Akademik", href: "/admin/nilai-akademik", icon: FileSpreadsheet, roles: ["super_admin", "admin"] },
  { type: "label", label: "Assessment" },
  { type: "item", label: "Quiz", href: "/guru/quiz", icon: FileQuestion, roles: ["super_admin", "admin"] },
  { type: "item", label: "CBT", href: "/guru/cbt", icon: Monitor, roles: ["super_admin", "admin"] },
  { type: "item", label: "Hasil Ujian", href: "/guru/hasil-ujian", icon: ClipboardCheck, roles: ["super_admin", "admin"] },
  { type: "item", label: "Analitik", href: "/guru/analitik", icon: BarChart3, roles: ["super_admin", "admin"] },
  { type: "item", label: "PKL", href: "/admin/pkl", icon: Award, roles: ["super_admin", "admin"] },

  { type: "item", label: "Beranda", href: "/guru", icon: LayoutDashboard, roles: ["guru"] },
  { type: "item", label: "Kelas Saya", href: "/guru/kelas", icon: BookOpen, roles: ["guru"] },
  { type: "item", label: "Pembelajaran", href: "/guru/materi", icon: BookMarked, roles: ["guru"] },
  { type: "item", label: "Tugas", href: "/guru/tugas", icon: ClipboardList, roles: ["guru"] },
  { type: "item", label: "Pengumpulan", href: "/guru/pengumpulan", icon: Send, roles: ["guru"] },
  { type: "item", label: "Penilaian", href: "/guru/penilaian", icon: Award, roles: ["guru"] },
  { type: "item", label: "Jadwal Pelajaran", href: "/guru/jadwal-pelajaran", icon: Calendar, roles: ["guru"] },
  { type: "item", label: "Pengumuman", href: "/guru/pengumuman", icon: Megaphone, roles: ["guru"] },

  { type: "item", label: "Beranda", href: "/siswa", icon: LayoutDashboard, roles: ["siswa"] },
  { type: "item", label: "Pelajaran", href: "/siswa/pelajaran", icon: GraduationCap, roles: ["siswa"] },
  { type: "item", label: "Tugas", href: "/siswa/tugas", icon: ClipboardList, roles: ["siswa"] },
  { type: "item", label: "Jadwal Pelajaran", href: "/siswa/jadwal-pelajaran", icon: Calendar, roles: ["siswa"] },
  { type: "item", label: "Absensi", href: "/siswa/absensi", icon: CalendarCheck, roles: ["siswa"] },
  { type: "item", label: "Pengumuman", href: "/siswa/pengumuman", icon: Megaphone, roles: ["siswa"] },

  { type: "item", label: "Beranda", href: "/wali", icon: LayoutDashboard, roles: ["wali"] },
  { type: "item", label: "Siswa", href: "/wali/siswa", icon: Users, roles: ["wali"] },
  { type: "item", label: "Laporan", href: "/wali/laporan", icon: BookOpen, roles: ["wali"] },
  { type: "item", label: "PKL", href: "/wali/pkl", icon: Award, roles: ["wali"] },
]

const roleLabels: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  guru: "Guru",
  siswa: "Siswa",
  wali: "Wali Kelas",
}

function SidebarContent({
  collapsed,
  onToggleCollapse,
  onCloseMobile,
}: {
  collapsed: boolean
  onToggleCollapse?: () => void
  onCloseMobile?: () => void
}) {
  const { logout, hasRole, user } = useAuth()
  const pathname = usePathname()

  const userRole = user?.role ?? "admin"
  const roleLabel = roleLabels[userRole] ?? "Admin"

  const filteredNav = navItems.filter((entry) => {
    if (entry.type === "label") return true
    return hasRole(...entry.roles)
  })

  const handleNavigate = () => {
    onCloseMobile?.()
  }

  const rolePath =
    userRole === "guru"
      ? "guru"
      : userRole === "siswa"
        ? "siswa"
        : userRole === "wali"
          ? "wali"
          : "admin"

  return (
    <>
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
        {filteredNav.map((entry) => {
          if (entry.type === "label") {
            if (collapsed) return null
            return (
              <div key={entry.label} className="px-3 pt-4 pb-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/60">
                  {entry.label}
                </span>
              </div>
            )
          }
          const isActive =
            pathname === entry.href || pathname.startsWith(entry.href + "/")
          return (
            <Link
              key={entry.href}
              href={entry.href}
              onClick={handleNavigate}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <entry.icon className="h-5 w-5 shrink-0" />
              {!collapsed && <span>{entry.label}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 pb-4 space-y-1">
        <Separator className="mb-2" />
        <Link
          href={`/${rolePath}/profil`}
          onClick={handleNavigate}
          className={cn(
            "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors",
            "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          <User className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Profil</span>}
        </Link>
        <Link
          href={`/${rolePath}/pengaturan`}
          onClick={handleNavigate}
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

      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-border shadow-sm flex items-center justify-center hover:bg-muted transition-colors z-10"
          aria-label={collapsed ? "Perluas menu" : "Ciutkan menu"}
        >
          {collapsed ? (
            <ChevronRight className="h-3 w-3" />
          ) : (
            <ChevronLeft className="h-3 w-3" />
          )}
        </button>
      )}
    </>
  )
}

export function Sidebar({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <>
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-white border-r border-border transition-all duration-300 sticky top-0",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </aside>

      <AnimatePresence>
        {open && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-white shadow-xl flex flex-col"
            >
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-muted transition-colors"
                aria-label="Tutup menu"
              >
                <X className="h-5 w-5" />
              </button>
              <SidebarContent
                collapsed={false}
                onCloseMobile={() => onOpenChange(false)}
              />
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
