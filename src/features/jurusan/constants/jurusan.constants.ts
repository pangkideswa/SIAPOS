export const STATUS_LABELS = {
  active: "Aktif",
  inactive: "Tidak Aktif",
} as const

export const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
} as const

export const EMPTY_JURUSAN_FORM = {
  name: "",
  code: "",
  is_active: true,
  description: "",
}
