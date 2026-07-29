import type { HariOption } from "../types/jadwal-pelajaran"

export const HARI_OPTIONS: HariOption[] = [
  { label: "Senin", value: "Senin" },
  { label: "Selasa", value: "Selasa" },
  { label: "Rabu", value: "Rabu" },
  { label: "Kamis", value: "Kamis" },
  { label: "Jumat", value: "Jumat" },
  { label: "Sabtu", value: "Sabtu" },
]

export const HARI_INDEX: Record<string, number> = {
  Senin: 0,
  Selasa: 1,
  Rabu: 2,
  Kamis: 3,
  Jumat: 4,
  Sabtu: 5,
}

export const JAM_OPTIONS = [
  "07:00 - 08:30",
  "08:30 - 10:00",
  "10:15 - 11:45",
  "12:30 - 14:00",
]

export const STATUS_JADWAL_COLORS: Record<string, string> = {
  Aktif: "bg-green-100 text-green-800",
  "Tidak Aktif": "bg-red-100 text-red-800",
}
