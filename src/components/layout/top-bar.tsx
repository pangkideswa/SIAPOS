"use client"

import { useAuth } from "@/contexts/auth-context"
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
import { LogOut, User, Bell, Search, Settings } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
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
  if (pathname.startsWith("/admin/pengaturan")) return "Pengaturan Sekolah"
  if (pathname.startsWith("/admin")) return "Beranda"
  if (pathname.match(/^\/guru\/materi\/\d+$/)) return "Detail Materi"
  if (pathname.startsWith("/guru/materi")) return "Materi Pembelajaran"
  if (pathname.match(/^\/guru\/tugas\/\d+$/)) return "Detail Tugas"
  if (pathname.startsWith("/guru/tugas")) return "Tugas"
  if (pathname.match(/^\/guru\/pengumpulan\/\d+$/)) return "Detail Pengumpulan"
  if (pathname.startsWith("/guru/pengumpulan")) return "Pengumpulan Tugas"
  if (pathname.startsWith("/guru/kelas")) return "Kelas Saya"
  if (pathname.match(/^\/guru\/penilaian\/\d+$/)) return "Detail Penilaian"
  if (pathname.startsWith("/guru/penilaian")) return "Penilaian"
  if (pathname.startsWith("/guru")) return "Beranda"
  if (pathname.startsWith("/siswa/pelajaran")) return "Pelajaran"
  if (pathname.startsWith("/siswa/tugas")) return "Tugas"
  if (pathname.startsWith("/siswa/simulasi")) return "Simulasi Kirim Tugas"
  if (pathname.startsWith("/siswa")) return "Beranda"
  if (pathname.startsWith("/wali/siswa")) return "Siswa"
  if (pathname.startsWith("/wali/laporan")) return "Laporan"
  if (pathname.startsWith("/wali")) return "Beranda"
  return "Beranda"
}

export function TopBar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  const [searchOpen, setSearchOpen] = useState(false)

  const pageTitle = getPageTitle(pathname)

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 md:px-6 shrink-0">
      <div className="flex items-center gap-3">
        <div className="md:hidden flex items-center gap-2">
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

        <Button variant="ghost" size="icon-sm" className="relative">
          <Bell className="h-4 w-4 text-muted-foreground" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-orange rounded-full border-2 border-white" />
        </Button>

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
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              Profil Saya
            </DropdownMenuItem>
            <DropdownMenuItem>
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
