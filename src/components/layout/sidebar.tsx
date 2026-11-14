"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  School,
  BookMarked,
  UserCog,
  ClipboardList,
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
  X,
} from "lucide-react"
import { cn, getInitials } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import type { UserRole } from "@/types/auth"

type NavEntry =
  | { type: "item"; label: string; href: string; icon: React.ComponentType<{ className?: string }>; roles: UserRole[] }
  | { type: "label"; label: string }

const navItems: NavEntry[] = [
  // --- ADMIN & SUPER ADMIN ---
  { type: "label", label: "Utama" },
  { type: "item", label: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["super_admin", "admin"] },
  { type: "item", label: "Pengumuman", href: "/admin/pengumuman", icon: Megaphone, roles: ["super_admin", "admin"] },
  
  { type: "label", label: "Data Master" },
  { type: "item", label: "Pengguna", href: "/admin/users", icon: Users, roles: ["super_admin", "admin"] },
  { type: "item", label: "Jurusan", href: "/admin/jurusan", icon: Layers, roles: ["super_admin", "admin"] },
  { type: "item", label: "Guru", href: "/admin/guru", icon: GraduationCap, roles: ["super_admin", "admin"] },
  { type: "item", label: "Siswa", href: "/admin/siswa", icon: Users, roles: ["super_admin", "admin"] },
  { type: "item", label: "Kelas", href: "/admin/classes", icon: School, roles: ["super_admin", "admin"] },
  { type: "item", label: "Mata Pelajaran", href: "/admin/subjects", icon: BookMarked, roles: ["super_admin", "admin"] },
  
  { type: "label", label: "Akademik & KBM" },
  { type: "item", label: "Kalender Akademik", href: "/admin/kalender-akademik", icon: CalendarDays, roles: ["super_admin", "admin"] },
  { type: "item", label: "Jadwal Pelajaran", href: "/admin/jadwal-pelajaran", icon: Calendar, roles: ["super_admin", "admin"] },
  { type: "item", label: "Penugasan Guru", href: "/admin/assignments", icon: UserCog, roles: ["super_admin", "admin"] },
  { type: "item", label: "Kelas Mengajar", href: "/admin/kelas-mengajar", icon: BookOpenCheck, roles: ["super_admin", "admin"] },
  { type: "item", label: "Absensi", href: "/admin/absensi", icon: CalendarCheck, roles: ["super_admin", "admin"] },
  { type: "item", label: "Nilai Akademik", href: "/admin/nilai-akademik", icon: FileSpreadsheet, roles: ["super_admin", "admin"] },
  
  { type: "label", label: "Evaluasi & Ujian" },
  { type: "item", label: "Simulasi Tugas", href: "/admin/simulasi-tugas", icon: ClipboardCheck, roles: ["super_admin", "admin"] },
  { type: "item", label: "Bank Soal", href: "/admin/bank-soal", icon: ListChecks, roles: ["super_admin", "admin"] },
  { type: "item", label: "Paket Soal", href: "/admin/paket-soal", icon: ClipboardList, roles: ["super_admin", "admin"] },
  { type: "item", label: "Quiz", href: "/guru/quiz", icon: FileQuestion, roles: ["super_admin", "admin"] },
  { type: "item", label: "CBT", href: "/guru/cbt", icon: Monitor, roles: ["super_admin", "admin"] },
  { type: "item", label: "Hasil Ujian", href: "/guru/hasil-ujian", icon: ClipboardCheck, roles: ["super_admin", "admin"] },

  { type: "label", label: "Mendatang" },
  { type: "item", label: "PKL", href: "/admin/pkl", icon: Award, roles: ["super_admin", "admin"] },
  { type: "item", label: "Analitik", href: "/guru/analitik", icon: BarChart3, roles: ["super_admin", "admin"] },

  // --- GURU ---
  { type: "label", label: "Utama" },
  { type: "item", label: "Dashboard", href: "/guru", icon: LayoutDashboard, roles: ["guru"] },
  { type: "item", label: "Pengumuman", href: "/guru/pengumuman", icon: Megaphone, roles: ["guru"] },

  { type: "label", label: "Akademik & KBM" },
  { type: "item", label: "Kelas", href: "/guru/kelas", icon: BookOpen, roles: ["guru"] },
  { type: "item", label: "Jadwal", href: "/guru/jadwal-pelajaran", icon: Calendar, roles: ["guru"] },
  { type: "item", label: "Absensi", href: "/guru/absensi", icon: CalendarCheck, roles: ["guru"] },
  { type: "item", label: "Rekap Absensi", href: "/guru/absensi/rekap", icon: ClipboardCheck, roles: ["guru"] },

  { type: "label", label: "Tugas & Penilaian" },
  { type: "item", label: "Tugas", href: "/guru/tugas", icon: ClipboardList, roles: ["guru"] },
  { type: "item", label: "Pengumpulan", href: "/guru/pengumpulan", icon: ClipboardCheck, roles: ["guru"] },
  { type: "item", label: "Penilaian", href: "/guru/penilaian", icon: Award, roles: ["guru"] },

  { type: "label", label: "Evaluasi & Ujian" },
  { type: "item", label: "Simulasi Tugas", href: "/guru/simulasi-tugas", icon: ClipboardCheck, roles: ["guru"] },
  { type: "item", label: "Bank Soal", href: "/guru/bank-soal", icon: ListChecks, roles: ["guru"] },
  { type: "item", label: "Paket Soal", href: "/guru/paket-soal", icon: ClipboardList, roles: ["guru"] },
  { type: "item", label: "Quiz", href: "/guru/quiz", icon: FileQuestion, roles: ["guru"] },
  { type: "item", label: "CBT", href: "/guru/cbt", icon: Monitor, roles: ["guru"] },

  // --- SISWA ---
  { type: "label", label: "Utama" },
  { type: "item", label: "Dashboard", href: "/siswa", icon: LayoutDashboard, roles: ["siswa"] },
  { type: "item", label: "Pengumuman", href: "/siswa/pengumuman", icon: Megaphone, roles: ["siswa"] },

  { type: "label", label: "Akademik & KBM" },
  { type: "item", label: "Jadwal", href: "/siswa/jadwal-pelajaran", icon: Calendar, roles: ["siswa"] },
  { type: "item", label: "Absensi", href: "/siswa/absensi", icon: CalendarCheck, roles: ["siswa"] },
  { type: "item", label: "Kelas", href: "/siswa/kelas", icon: BookOpen, roles: ["siswa"] },
  { type: "item", label: "Nilai", href: "/siswa/nilai-akademik", icon: FileSpreadsheet, roles: ["siswa"] },

  { type: "label", label: "Tugas & Ujian" },
  { type: "item", label: "Tugas", href: "/siswa/tugas", icon: ClipboardList, roles: ["siswa"] },
  { type: "item", label: "Quiz", href: "/siswa/quiz", icon: FileQuestion, roles: ["siswa"] },
  { type: "item", label: "CBT", href: "/siswa/cbt", icon: Monitor, roles: ["siswa"] },
]

const roleLabels: Record<string, string> = {
  super_admin: "Super Admin",
  admin: "Admin Sekolah",
  guru: "Guru Pengajar",
  siswa: "Siswa",
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
  const { hasRole, user } = useAuth()
  const { settings } = useSettings()
  const pathname = usePathname()

  const userRole = user?.role ?? "admin"
  const roleLabel = roleLabels[userRole] ?? "Pengguna"

  const filteredNav = navItems.reduce<NavEntry[]>((items, entry, index) => {
    if (entry.type === "label") {
      let sectionHasVisibleItem = false
      for (let i = index + 1; i < navItems.length; i += 1) {
        const nextEntry = navItems[i]
        if (nextEntry.type === "label") break
        if (nextEntry.type === "item" && hasRole(...nextEntry.roles)) {
          sectionHasVisibleItem = true
          break
        }
      }
      if (sectionHasVisibleItem) {
        items.push(entry)
      }
      return items
    }

    if (entry.type === "item" && hasRole(...entry.roles)) {
      items.push(entry)
    }

    return items
  }, [])

  const handleNavigate = () => {
    onCloseMobile?.()
  }

  return (
    <>
      {/* Brand Header */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/80 shrink-0">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-card border border-primary/20 shadow-md shadow-primary/10 overflow-hidden p-1 shrink-0 transition-transform group-hover:scale-105 active:scale-95">
            <img src="/favicon.png" alt="Logo SIAPOS" className="w-full h-full object-contain" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-base tracking-tight leading-none text-foreground truncate">
                  {settings.pengaturan_sistem?.nama_aplikasi || "SIAPOS"}
                </span>
                <span className="inline-flex items-center gap-1 text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                  </span>
                  v2.0
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-medium mt-0.5 truncate">
                {roleLabel}
              </span>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1 scrollbar-thin">
        {filteredNav.map((entry) => {
          if (entry.type === "label") {
            if (collapsed) return null
            return (
              <div key={entry.label} className="px-3 pt-3.5 pb-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-muted-foreground/70">
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
              title={collapsed ? entry.label : undefined}
              className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 select-none active:scale-[0.98]",
                isActive
                  ? "bg-primary text-white shadow-md shadow-primary/25 font-bold"
                  : "text-muted-foreground hover:bg-muted/80 hover:text-foreground active:bg-primary/10 active:text-primary"
              )}
            >
              <entry.icon
                className={cn(
                  "h-4 w-4 sm:h-5 sm:w-5 shrink-0 transition-transform group-hover:scale-110",
                  isActive ? "text-white" : "text-muted-foreground group-hover:text-foreground"
                )}
              />
              {!collapsed && <span className="truncate">{entry.label}</span>}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Sidebar Bottom Profile Card */}
      {!collapsed && user && (
        <div className="p-3 border-t border-border/80 shrink-0">
          <div className="flex items-center gap-2.5 p-2 rounded-2xl bg-card border border-border/80 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-xs shrink-0 border border-primary/20">
              {user.name ? getInitials(user.name) : "?"}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <span className="text-xs font-bold text-foreground truncate leading-tight">
                {user.name}
              </span>
              <span className="text-[10px] text-muted-foreground truncate leading-tight mt-0.5">
                {roleLabel}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Collapse Toggle Button */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-card border border-border shadow-md flex items-center justify-center hover:bg-muted active:scale-95 transition-all z-20"
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
      {/* Desktop Sticky Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen bg-card/85 dark:bg-card/90 backdrop-blur-xl border-r border-border/80 transition-all duration-300 sticky top-0 z-30",
          collapsed ? "w-[68px]" : "w-64"
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      </aside>

      {/* Mobile Drawer Sidebar */}
      <AnimatePresence>
        {open && (
          <div className="md:hidden fixed inset-0 z-50">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              aria-hidden="true"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute inset-y-0 left-0 w-72 max-w-[85vw] bg-card border-r border-border/80 shadow-2xl flex flex-col"
            >
              <button
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-xl bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Tutup menu"
              >
                <X className="h-4 w-4" />
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
