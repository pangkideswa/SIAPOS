"use client"

import { useAuth } from "@/contexts/auth-context"
import { NotificationBell } from "@/features/notifications/components/notification-bell"
import { ThemeToggle } from "@/components/theme-toggle"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut, User, Search, Settings, Menu, Clock } from "lucide-react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import type { UserRole } from "@/types/auth"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)
}

function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    super_admin: "Super Admin",
    admin: "Admin",
    guru: "Guru",
    siswa: "Siswa",
    wali: "Wali Kelas",
  }
  return labels[role] ?? role
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
  if (pathname.startsWith("/admin")) return "Beranda"
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
  if (pathname.startsWith("/guru")) return "Dashboard"
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
  if (pathname.startsWith("/siswa")) return "Dashboard"
  if (pathname.startsWith("/wali/siswa")) return "Siswa"
  if (pathname.startsWith("/wali/laporan")) return "Laporan"
  if (pathname.startsWith("/wali")) return "Beranda"
  if (pathname === "/forbidden") return "Akses Ditolak"
  return "Beranda"
}

export function TopBar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { user, logout } = useAuth()
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
  const timeLabel = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onMenuClick}
            aria-label="Buka menu"
            className="-ml-1"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white font-bold text-sm shadow-sm shadow-primary/20">
            SI
          </div>
          <span className="font-bold text-lg tracking-tight">SIAPOS</span>
        </div>
        <div className="hidden md:block">
          <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden xl:flex items-center gap-2 text-xs text-muted-foreground px-2.5 py-1.5 rounded-lg bg-muted whitespace-nowrap">
          <Clock className="h-4 w-4" />
          <span>
            {dateLabel}, {timeLabel}
          </span>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          {searchOpen ? (
            <div className="flex items-center">
              <Input
                type="text"
                placeholder="Cari..."
                className="w-48 lg:w-64 h-8"
                autoFocus
                onBlur={() => setSearchOpen(false)}
              />
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="h-4 w-4 text-muted-foreground" />
            </Button>
          )}
        </div>

        <ThemeToggle />
        <NotificationBell />

        <span className="hidden lg:block text-xs text-muted-foreground px-2 py-1 rounded-lg bg-muted">
          {getRoleLabel(user?.role ?? "admin" as UserRole)}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger className="focus:outline-none">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary/10 text-primary font-medium text-xs">
                {user?.name ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuLabel>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-muted-foreground font-normal">
                {user?.email}
              </p>
              <span className="inline-block mt-1 text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {getRoleLabel(user?.role ?? "admin" as UserRole)}
              </span>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push(`/${user?.role === "guru" ? "guru" : user?.role === "siswa" ? "siswa" : user?.role === "wali" ? "wali" : "admin"}/profil`)}>
              <User className="mr-2 h-4 w-4" />
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push(`/${user?.role === "guru" ? "guru" : user?.role === "siswa" ? "siswa" : user?.role === "wali" ? "wali" : "admin"}/pengaturan`)}>
              <Settings className="mr-2 h-4 w-4" />
              Pengaturan
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              variant="destructive"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
