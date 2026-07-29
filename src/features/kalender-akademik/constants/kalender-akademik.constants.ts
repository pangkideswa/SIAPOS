import type { KategoriEvent, StatusEvent } from "../types/kalender-akademik"

export const KATEGORI_OPTIONS: KategoriEvent[] = [
  "Awal Semester",
  "Akhir Semester",
  "Libur Nasional",
  "Libur Sekolah",
  "UTS",
  "UAS",
  "Asesmen",
  "PKL",
  "Pengumuman",
  "Kegiatan Sekolah",
  "Rapat Guru",
  "Hari Besar Nasional",
  "Lainnya",
]

export const STATUS_EVENT_OPTIONS: StatusEvent[] = [
  "Aktif",
  "Selesai",
  "Akan Datang",
]

export const TAHUN_AJARAN_OPTIONS = [
  "2024/2025",
  "2025/2026",
  "2026/2027",
] as const

export const SEMESTER_OPTIONS = ["Ganjil", "Genap"] as const

export const KATEGORI_COLORS: Record<KategoriEvent, string> = {
  "Awal Semester": "bg-blue-100 text-blue-800",
  "Akhir Semester": "bg-purple-100 text-purple-800",
  "Libur Nasional": "bg-red-100 text-red-800",
  "Libur Sekolah": "bg-orange-100 text-orange-800",
  UTS: "bg-yellow-100 text-yellow-800",
  UAS: "bg-pink-100 text-pink-800",
  Asesmen: "bg-indigo-100 text-indigo-800",
  PKL: "bg-cyan-100 text-cyan-800",
  Pengumuman: "bg-green-100 text-green-800",
  "Kegiatan Sekolah": "bg-teal-100 text-teal-800",
  "Rapat Guru": "bg-gray-100 text-gray-800",
  "Hari Besar Nasional": "bg-rose-100 text-rose-800",
  Lainnya: "bg-slate-100 text-slate-800",
}

export const STATUS_EVENT_COLORS: Record<StatusEvent, string> = {
  Aktif: "bg-green-100 text-green-800",
  Selesai: "bg-gray-100 text-gray-800",
  "Akan Datang": "bg-blue-100 text-blue-800",
}

export const BULAN_OPTIONS = [
  { label: "Januari", value: "0" },
  { label: "Februari", value: "1" },
  { label: "Maret", value: "2" },
  { label: "April", value: "3" },
  { label: "Mei", value: "4" },
  { label: "Juni", value: "5" },
  { label: "Juli", value: "6" },
  { label: "Agustus", value: "7" },
  { label: "September", value: "8" },
  { label: "Oktober", value: "9" },
  { label: "November", value: "10" },
  { label: "Desember", value: "11" },
]

export const EMPTY_EVENT_FORM = {
  nama_event: "",
  deskripsi: "",
  kategori: "Lainnya" as KategoriEvent,
  tanggal_mulai: "",
  tanggal_selesai: "",
  tahun_ajaran: "2026/2027",
  semester: "Ganjil",
  status: "Aktif" as StatusEvent,
}
