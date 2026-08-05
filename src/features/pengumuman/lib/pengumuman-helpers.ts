import type { Pengumuman, TargetPengumuman } from "../types/pengumuman"
import type { UserRole } from "@/types/auth"

export type PengumumanRole = "admin" | "guru" | "siswa"

export function getPengumumanTargetRoles(
  target: TargetPengumuman
): UserRole[] {
  switch (target) {
    case "Guru":
      return ["guru"]
    case "Siswa":
    case "Kelas Tertentu":
      return ["siswa"]
    case "Semua Pengguna":
    default:
      return ["super_admin", "guru", "siswa"]
  }
}

export function filterPengumumanByRole(
  role: PengumumanRole,
  list: Pengumuman[]
): Pengumuman[] {
  return list
    .filter(
      (d) =>
        d.status === "Dipublikasikan" &&
        (role === "admin" ||
          (role === "guru" &&
            (d.target === "Semua Pengguna" || d.target === "Guru")) ||
          (role === "siswa" &&
            (d.target === "Semua Pengguna" ||
              d.target === "Siswa" ||
              d.target === "Kelas Tertentu")))
    )
    .sort(
      (a, b) =>
        Number(b.pinned) - Number(a.pinned) ||
        b.tanggal_publish.localeCompare(a.tanggal_publish)
    )
}
