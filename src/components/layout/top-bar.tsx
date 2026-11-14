"use client"

import { useAuth } from "@/contexts/auth-context"
import { useSettings } from "@/contexts/settings-context"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, User, Search, Settings, Menu, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import React, { Component, type ReactNode } from "react"
import type { UserRole } from "@/types/auth"
import { getInitials, cn } from "@/lib/utils"
import { to24HourTime } from "@/lib/date-utils"

class AvatarErrorBoundary extends Component<{children: ReactNode}, {error: unknown}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  render() {
    if (this.state.error) {
      const err = this.state.error as Error
      return <div className="p-4 text-red-500 text-xs break-words">{String(err.stack || err)}</div>;
    }
    return this.props.children;
  }
}

function getRoleLabel(role: UserRole): string {
  const labels: Record<string, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    guru: "Guru",
    siswa: "Siswa",
  }
  return labels[role] ?? role
}

function getRoleBadgeStyle(role: UserRole) {
  switch (role) {
    case "super_admin":
    case "admin":
      return "bg-primary/10 text-primary border-primary/20"
    case "guru":
      return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20"
    case "siswa":
      return "bg-orange/10 text-orange border-orange/20"
    default:
      return "bg-muted text-muted-foreground border-border"
  }
}

function getPageTitle(pathname: string): string {
  if (pathname.match(/^\/admin\/users\/\d+$/)) return "Detail Pengguna"
  if (pathname.startsWith("/admin/users")) return "Pengguna"
  if (pathname.match(/^\/admin\/jurusan\/\d+$/)) return "Detail Jurusan"
  if (pathname.startsWith("/admin/jurusan")) return "Jurusan"
  if (pathname.match(/^\/admin\/guru\/\d+$/)) return "Detail Guru"
  if (pathname.startsWith("/admin/guru")) return "Data Guru"
  if (pathname.match(/^\/admin\/siswa\/\d+$/)) return "Detail Siswa"
  if (pathname.startsWith("/admin/siswa")) return "Data Siswa"
  if (pathname.startsWith("/admin/classes")) return "Kelas"
  if (pathname.startsWith("/admin/subjects")) return "Mata Pelajaran"
  if (pathname.startsWith("/admin/assignments")) return "Penugasan Guru"
  if (pathname.startsWith("/admin/kelas-mengajar")) return "Kelas Mengajar"
  if (pathname.match(/^\/admin\/bank-soal\/\d+$/)) return "Detail Soal"
  if (pathname.startsWith("/admin/bank-soal")) return "Bank Soal"
  if (pathname.match(/^\/admin\/paket-soal\/\d+$/)) return "Detail Paket Soal"
  if (pathname.startsWith("/admin/paket-soal")) return "Paket Soal"
  if (pathname.match(/^\/admin\/absensi\/rekap$/)) return "Rekap Absensi"
  if (pathname.match(/^\/admin\/absensi\/\d+$/)) return "Detail Absensi"
  if (pathname.startsWith("/admin/absensi")) return "Absensi"
  if (pathname.startsWith("/admin/pengaturan")) return "Pengaturan Sekolah"
  if (pathname.startsWith("/admin/nilai-akademik")) return "Nilai Akademik"
  if (pathname.match(/^\/admin\/pengumuman\/\d+$/)) return "Detail Pengumuman"
  if (pathname.startsWith("/admin/pengumuman")) return "Pengumuman"
  if (pathname.startsWith("/admin")) return "Dashboard Admin"
  if (pathname.match(/^\/guru\/kelas\/\d+$/)) return "Detail Kelas"
  if (pathname.startsWith("/guru/kelas")) return "Kelas Saya"
  if (pathname.match(/^\/guru\/materi\/\d+$/)) return "Detail Materi"
  if (pathname.startsWith("/guru/materi")) return "Materi"
  if (pathname.match(/^\/guru\/tugas\/\d+$/)) return "Detail Tugas"
  if (pathname.startsWith("/guru/tugas")) return "Tugas"
  if (pathname.match(/^\/guru\/pengumpulan\/\d+$/)) return "Detail Pengumpulan"
  if (pathname.startsWith("/guru/pengumpulan")) return "Pengumpulan"
  if (pathname.match(/^\/guru\/penilaian\/\d+$/)) return "Detail Penilaian"
  if (pathname.startsWith("/guru/penilaian")) return "Penilaian"
  if (pathname.match(/^\/guru\/quiz\/\d+$/)) return "Detail Quiz"
  if (pathname.startsWith("/guru/quiz")) return "Quiz"
  if (pathname.match(/^\/guru\/cbt\/\d+$/)) return "Detail CBT"
  if (pathname.startsWith("/guru/cbt")) return "CBT"
  if (pathname.match(/^\/guru\/hasil-ujian\/\d+$/)) return "Detail Hasil Ujian"
  if (pathname.startsWith("/guru/hasil-ujian")) return "Hasil Ujian"
  if (pathname.startsWith("/guru/analitik")) return "Analitik Penilaian"
  if (pathname.match(/^\/guru\/absensi\/\d+$/)) return "Input Absensi"
  if (pathname.startsWith("/guru/absensi")) return "Riwayat Absensi"
  if (pathname.startsWith("/guru/nilai-akademik")) return "Nilai Akademik"
  if (pathname.match(/^\/guru\/pengumuman\/\d+$/)) return "Detail Pengumuman"
  if (pathname.startsWith("/guru/pengumuman")) return "Pengumuman"
  if (pathname.startsWith("/guru")) return "Dashboard Guru"
  if (pathname.match(/^\/siswa\/kelas\/\d+$/)) return "Detail Kelas"
  if (pathname.startsWith("/siswa/kelas")) return "Kelas Saya"
  if (pathname.startsWith("/siswa/pelajaran")) return "Kelas Saya"
  if (pathname.startsWith("/siswa/jadwal-pelajaran")) return "Jadwal Pelajaran"
  if (pathname.startsWith("/siswa/tugas")) return "Tugas"
  if (pathname.match(/^\/siswa\/quiz\/\d+\/kerjakan$/)) return "Mengerjakan Quiz"
  if (pathname.match(/^\/siswa\/quiz\/\d+\/hasil$/)) return "Hasil Quiz"
  if (pathname.startsWith("/siswa/quiz")) return "Quiz"
  if (pathname.match(/^\/siswa\/cbt\/\d+\/ujian$/)) return "Mengerjakan Ujian CBT"
  if (pathname.match(/^\/siswa\/cbt\/\d+\/hasil$/)) return "Hasil Ujian CBT"
  if (pathname.match(/^\/siswa\/cbt\/\d+$/)) return "Detail Ujian CBT"
  if (pathname.startsWith("/siswa/cbt")) return "Ujian CBT"
  if (pathname.match(/^\/siswa\/hasil-ujian\/\d+$/)) return "Detail Hasil Ujian"
  if (pathname.startsWith("/siswa/hasil-ujian")) return "Hasil Ujian"
  if (pathname.startsWith("/siswa/simulasi")) return "Simulasi Kirim Tugas"
  if (pathname.startsWith("/siswa/absensi")) return "Absensi Saya"
  if (pathname.startsWith("/siswa/nilai-akademik")) return "Nilai Akademik"
  if (pathname.match(/^\/siswa\/pengumuman\/\d+$/)) return "Detail Pengumuman"
  if (pathname.startsWith("/siswa/pengumuman")) return "Pengumuman"
  if (pathname.startsWith("/siswa/profil")) return "Profil"
  if (pathname.startsWith("/siswa/pengaturan")) return "Pengaturan"
  if (pathname.startsWith("/siswa")) return "Dashboard Siswa"
  if (pathname === "/forbidden") return "Akses Ditolak"
  return "Beranda"
}

export function TopBar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth()
  const { settings } = useSettings()
  const pathname = usePathname()
  const router = useRouter()
  const [searchOpen, setSearchOpen] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pageTitle = getPageTitle(pathname)

  const dateLabel = now.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
  })
  const shortDateLabel = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
  })
  const timeLabel = to24HourTime(now, true)

  const userRole = (user?.role ?? "admin") as UserRole

  return (
    <header className="h-16 border-b border-border/80 bg-background/70 backdrop-blur-xl flex items-center justify-between px-4 md:px-6 shrink-0 sticky top-0 z-30">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 md:hidden">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMenuClick}
            aria-label="Buka menu navigasi"
            className="-ml-1 rounded-xl hover:bg-muted active:scale-95 transition-all"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          
          <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-card border border-primary/20 shadow-sm p-1 overflow-hidden">
            <img src="/favicon.png" alt="Logo SIAPOS" className="w-full h-full object-contain" />
          </div>
          
          {/* Mobile Clock */}
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground px-2.5 py-1 rounded-full bg-card border border-border/80 shadow-sm whitespace-nowrap ml-1 overflow-hidden max-w-[170px] sm:max-w-none">
            <span className="relative flex h-1.5 w-1.5 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
            </span>
            <span className="truncate font-semibold">
              <span className="hidden sm:inline">{dateLabel}, </span>
              <span className="sm:hidden">{shortDateLabel}, </span>
              {timeLabel} WIB
            </span>
          </div>
        </div>

        {/* Desktop Breadcrumb/Title */}
        <div className="hidden md:flex items-center gap-2">
          <h1 className="text-base sm:text-lg font-black tracking-tight text-foreground">
            {pageTitle}
          </h1>
        </div>
      </div>

      {/* Right Controls: Desktop Clock, Search, Theme, Notifications, Role Badge, Avatar */}
      <div className="flex items-center gap-2 sm:gap-2.5">
        {/* Live School Clock with Pulse Indicator */}
        <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-muted-foreground px-3 py-1.5 rounded-full bg-card/80 border border-border/80 shadow-sm backdrop-blur-md">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <Clock className="h-3.5 w-3.5 text-primary shrink-0" />
          <span>
            {dateLabel}, {timeLabel} WIB
          </span>
        </div>

        {/* Quick Search */}
        <div className="hidden sm:flex items-center">
          {searchOpen ? (
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Cari menu / data..."
                className="w-48 lg:w-60 h-9 rounded-xl bg-card border-border/80 text-xs focus-visible:ring-primary/30"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSearchOpen(true)}
              className="rounded-xl hover:bg-muted/80 active:scale-95 transition-all text-muted-foreground hover:text-foreground"
              aria-label="Cari"
            >
              <Search className="h-4 w-4" />
            </Button>
          )}
        </div>

        <ThemeToggle />
        <NotificationBell />

        {/* Role Pill Badge */}
        <span className={cn(
          "hidden lg:inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border shadow-xs select-none",
          getRoleBadgeStyle(userRole)
        )}>
          {getRoleLabel(userRole)}
        </span>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <button className="focus:outline-none rounded-full transition-transform active:scale-95">
                <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer shadow-xs">
                  <AvatarFallback className="bg-primary/10 text-primary font-black text-xs">
                    {user?.name ? getInitials(user.name) : "?"}
                  </AvatarFallback>
                </Avatar>
              </button>
            }
          />
          <DropdownMenuContent align="end" className="w-56 p-1.5 rounded-2xl border-border/80 shadow-xl backdrop-blur-xl">
            <AvatarErrorBoundary>
              <DropdownMenuGroup>
                <DropdownMenuLabel className="p-2.5">
                  <p className="font-bold text-sm text-foreground truncate">{user?.name}</p>
                  <p className="text-xs text-muted-foreground font-medium truncate mt-0.5">
                    {user?.email}
                  </p>
                  <span className={cn(
                    "inline-block mt-2 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full border",
                    getRoleBadgeStyle(userRole)
                  )}>
                    {getRoleLabel(userRole)}
                  </span>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="my-1 border-border/60" />
              <DropdownMenuItem
                onClick={() => router.push(`/${user?.role === "guru" ? "guru" : user?.role === "siswa" ? "siswa" : "admin"}/profil`)}
                className="rounded-xl py-2 cursor-pointer font-medium text-xs text-foreground/80 hover:text-foreground"
              >
                <User className="mr-2 h-4 w-4 text-primary" />
                Profil Saya
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push(`/${user?.role === "guru" ? "guru" : user?.role === "siswa" ? "siswa" : "admin"}/pengaturan`)}
                className="rounded-xl py-2 cursor-pointer font-medium text-xs text-foreground/80 hover:text-foreground"
              >
                <Settings className="mr-2 h-4 w-4 text-muted-foreground" />
                Pengaturan
              </DropdownMenuItem>
              <DropdownMenuSeparator className="my-1 border-border/60" />
              <DropdownMenuItem
                onClick={() => logout()}
                variant="destructive"
                className="rounded-xl py-2 cursor-pointer font-semibold text-xs text-destructive hover:bg-destructive/10"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar dari Akun
              </DropdownMenuItem>
            </AvatarErrorBoundary>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
