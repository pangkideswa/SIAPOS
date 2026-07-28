import type { AnalyticsFilterState } from "../types/analitik"

export const KELAS_ANALITIK_OPTIONS = [
  "Semua Kelas",
  "X TKJ 1",
  "X TKJ 2",
  "XI TKJ 1",
  "XI TKJ 2",
  "X TBSM 1",
  "X TBSM 2",
  "XI TBSM 1",
  "XI TBSM 2",
  "XII TKJ 1",
  "XII TKJ 2",
] as const

export const MATA_PELAJARAN_ANALITIK_OPTIONS = [
  "Semua Mata Pelajaran",
  "Dasar Jaringan",
  "Administrasi Sistem Jaringan",
  "Pemrograman Web",
  "Basis Data",
  "Sistem Operasi",
] as const

export const JENIS_UJIAN_ANALITIK_OPTIONS = [
  "Semua Jenis",
  "Quiz",
  "CBT",
  "Ulangan Harian",
  "PTS",
  "PAS",
  "Try Out",
] as const

export const EMPTY_FILTER: AnalyticsFilterState = {
  kelas: "Semua Kelas",
  mata_pelajaran: "Semua Mata Pelajaran",
  jenis_ujian: "Semua Jenis",
  tanggal_mulai: "",
  tanggal_akhir: "",
}

export const CHART_COLORS = {
  primary: "#2563EB",
  secondary: "#F97316",
  success: "#22C55E",
  danger: "#EF4444",
  warning: "#EAB308",
  muted: "#94A3B8",
  blue: "#3B82F6",
  green: "#22C55E",
  orange: "#F97316",
  red: "#EF4444",
  purple: "#A855F7",
  cyan: "#06B6D4",
  pink: "#EC4899",
}

export const STATUS_DISTRIBUTION_COLORS: Record<string, string> = {
  Lulus: "#22C55E",
  "Tidak Lulus": "#EF4444",
  "Menunggu Penilaian": "#EAB308",
}

export const JENIS_UJIAN_CHART_COLORS: Record<string, string> = {
  Quiz: "#3B82F6",
  CBT: "#A855F7",
  "Ulangan Harian": "#F97316",
  PTS: "#06B6D4",
  PAS: "#EC4899",
  "Try Out": "#22C55E",
}

export const INSIGHT_TYPE_STYLES: Record<string, { bg: string; border: string; text: string; icon: string }> = {
  peringatan: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
    icon: "text-red-500",
  },
  informasi: {
    bg: "bg-blue-50",
    border: "border-blue-200",
    text: "text-blue-800",
    icon: "text-blue-500",
  },
  rekomendasi: {
    bg: "bg-green-50",
    border: "border-green-200",
    text: "text-green-800",
    icon: "text-green-500",
  },
}
