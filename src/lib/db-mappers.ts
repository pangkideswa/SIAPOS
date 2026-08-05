import type { User as DbUser } from "@/generated/prisma/client"
import type { User, UserRole } from "@/types/auth"

export type DbRole = "SUPER_ADMIN" | "ADMIN" | "GURU" | "SISWA" | "WALI"

export function mapRole(role: string): UserRole {
  switch (role) {
    case "SUPER_ADMIN":
      return "super_admin"
    case "ADMIN":
      return "admin"
    case "GURU":
      return "guru"
    case "SISWA":
      return "siswa"
    case "WALI":
      return "wali"
    default:
      return "siswa"
  }
}

export function toRole(role: UserRole): DbRole {
  switch (role) {
    case "super_admin":
      return "SUPER_ADMIN"
    case "admin":
      return "ADMIN"
    case "guru":
      return "GURU"
    case "siswa":
      return "SISWA"
    case "wali":
      return "WALI"
    default:
      return "SISWA"
  }
}

export function toUser(row: DbUser): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: mapRole(row.role),
    provider: row.provider,
    providerId: row.providerId,
    image: row.image,
    emailVerified: row.emailVerified?.toISOString() ?? null,
    username: row.username ?? undefined,
    nip: row.nip,
    nisn: row.nisn,
    avatar: row.avatar,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

export function toMaterialStatus(status: string): "Draft" | "Publish" {
  return status === "PUBLISH" ? "Publish" : "Draft"
}

export function toMaterialStatusDb(status: "Draft" | "Publish"): "DRAFT" | "PUBLISH" {
  return status === "Publish" ? "PUBLISH" : "DRAFT"
}

export function toAssignmentStatus(
  status: string
): "Draft" | "Dipublikasikan" | "Ditutup" {
  switch (status) {
    case "PUBLISHED":
      return "Dipublikasikan"
    case "CLOSED":
      return "Ditutup"
    default:
      return "Draft"
  }
}

export function toAssignmentStatusDb(
  status: "Draft" | "Dipublikasikan" | "Ditutup"
): "DRAFT" | "PUBLISHED" | "CLOSED" {
  switch (status) {
    case "Dipublikasikan":
      return "PUBLISHED"
    case "Ditutup":
      return "CLOSED"
    default:
      return "DRAFT"
  }
}

export function toSubmissionStatus(
  status: string
): "Belum Mengumpulkan" | "Sudah Mengumpulkan" | "Terlambat" {
  switch (status) {
    case "SUBMITTED":
      return "Sudah Mengumpulkan"
    case "LATE":
      return "Terlambat"
    default:
      return "Belum Mengumpulkan"
  }
}

export function toAnnouncementStatus(
  status: string
): "Draft" | "Dipublikasikan" | "Diarsipkan" {
  switch (status) {
    case "PUBLISHED":
      return "Dipublikasikan"
    case "ARCHIVED":
      return "Diarsipkan"
    default:
      return "Draft"
  }
}

export function toAnnouncementStatusDb(
  status: "Draft" | "Dipublikasikan" | "Diarsipkan"
): "DRAFT" | "PUBLISHED" | "ARCHIVED" {
  switch (status) {
    case "Dipublikasikan":
      return "PUBLISHED"
    case "Diarsipkan":
      return "ARCHIVED"
    default:
      return "DRAFT"
  }
}

const DAY_LABELS: Record<string, string> = {
  SENIN: "Senin",
  SELASA: "Selasa",
  RABU: "Rabu",
  KAMIS: "Kamis",
  JUMAT: "Jumat",
  SABTU: "Sabtu",
  MINGGU: "Minggu",
}

export function toScheduleDay(day: string): string {
  return DAY_LABELS[day] ?? day
}
