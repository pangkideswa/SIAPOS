import type { StatusKehadiran } from "../types/absensi"

export const STATUS_KEHADIRAN_OPTIONS: readonly StatusKehadiran[] = [
  "Hadir",
  "Izin",
  "Sakit",
  "Alpha",
  "Terlambat",
] as const

export const STATUS_KEHADIRAN_COLORS: Record<StatusKehadiran, string> = {
  Hadir: "bg-green-100 text-green-800",
  Izin: "bg-blue-100 text-blue-800",
  Sakit: "bg-yellow-100 text-yellow-800",
  Alpha: "bg-red-100 text-red-800",
  Terlambat: "bg-orange-100 text-orange-800",
}

export const STATUS_SESI_OPTIONS = ["Selesai", "Berlangsung", "Belum"] as const

export const STATUS_SESI_COLORS: Record<string, string> = {
  Selesai: "bg-green-100 text-green-800",
  Berlangsung: "bg-blue-100 text-blue-800",
  Belum: "bg-muted text-foreground",
}
