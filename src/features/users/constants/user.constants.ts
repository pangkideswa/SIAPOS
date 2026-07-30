import type { UserRole } from "@/types/auth"

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  guru: "Guru",
  siswa: "Siswa",
  wali: "Wali Kelas",
}

export const ROLE_COLORS: Record<UserRole, string> = {
  super_admin: "bg-purple-100 text-purple-800",
  admin: "bg-blue-100 text-blue-800",
  guru: "bg-green-100 text-green-800",
  siswa: "bg-orange-100 text-orange-800",
  wali: "bg-teal-100 text-teal-800",
}

export const ALL_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "guru",
  "siswa",
  "wali",
]

export const ADMIN_MANAGEABLE_ROLES: UserRole[] = [
  "admin",
  "guru",
  "siswa",
  "wali",
]

export const EMPTY_USER_FORM = {
  name: "",
  username: "",
  email: "",
  password: "",
  password_confirmation: "",
  role: "siswa" as string,
  nip: "",
  nisn: "",
}
