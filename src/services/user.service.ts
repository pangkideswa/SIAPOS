import "server-only"
import { hash } from "bcryptjs"
import { userRepository } from "@/repositories/user.repository"
import { toUser, toRole } from "@/lib/db-mappers"
import type { User, UserRole } from "@/types/auth"
import { prisma } from "@/lib/prisma"
import { AppError } from "@/lib/api-utils"

export interface UserFilters {
  role?: string
  search?: string
  page?: number
  per_page?: number
}

export interface CreateUserInput {
  name: string
  username?: string | null
  email: string
  password: string
  role: UserRole
  nip?: string | null
  nisn?: string | null
}

export interface UpdateUserInput {
  name?: string
  username?: string | null
  email?: string
  password?: string | null
  role?: UserRole
  nip?: string | null
  nisn?: string | null
}

export interface UserListResult {
  data: User[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export const userService = {
  async getAll(filters: UserFilters = {}): Promise<UserListResult> {
    const per_page = filters.per_page ?? 1000
    const page = filters.page ?? 1

    const where = {
      ...(filters.role ? { role: toRole(filters.role as UserRole) } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" as const } },
              { email: { contains: filters.search, mode: "insensitive" as const } },
              { username: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    }

    const [rows, total] = await Promise.all([
      userRepository.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      userRepository.count(where),
    ])

    return {
      data: rows.map(toUser),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / per_page)),
        per_page,
        total,
      },
    }
  },

  async getById(id: number): Promise<User | null> {
    const user = await userRepository.findById(id)
    return user ? toUser(user) : null
  },

  async create(data: CreateUserInput): Promise<User> {
    const hashed = await hash(data.password, 10)
    const roleEnum = toRole(data.role)
    
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          username: data.username ?? null,
          email: data.email.toLowerCase(),
          password: hashed,
          role: roleEnum,
          nip: data.nip ?? null,
          nisn: data.nisn ?? null,
        }
      })

      if (roleEnum === "GURU") {
        await tx.teacher.create({
          data: {
            user_id: user.id,
            nama_lengkap: user.name,
            email: user.email!,
            nip: user.nip || `TCH-${Date.now()}`,
          }
        })
      } else if (roleEnum === "SISWA") {
        await tx.student.create({
          data: {
            user_id: user.id,
            nama_lengkap: user.name,
            nis: user.nisn || `NIS-${Date.now()}`,
            nisn: user.nisn || `NISN-${Date.now()}`,
          }
        })
      }
      return user
    })
    
    return toUser(result)
  },

  async update(id: number, data: UpdateUserInput): Promise<User | null> {
    const existing = await prisma.user.findUnique({ where: { id } })
    if (!existing) return null

    if (data.role && toRole(data.role) !== existing.role) {
      if (existing.role === "GURU" || existing.role === "SISWA" || toRole(data.role) === "GURU" || toRole(data.role) === "SISWA") {
        throw new AppError("Perubahan role yang melibatkan Guru atau Siswa tidak diizinkan. Silakan hapus akun dan buat ulang.", 400)
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.update({
        where: { id },
        data: {
          ...(data.name !== undefined ? { name: data.name } : {}),
          ...(data.username !== undefined ? { username: data.username } : {}),
          ...(data.email !== undefined ? { email: data.email.toLowerCase() } : {}),
          ...(data.role !== undefined ? { role: toRole(data.role) } : {}),
          ...(data.nip !== undefined ? { nip: data.nip } : {}),
          ...(data.nisn !== undefined ? { nisn: data.nisn } : {}),
          ...(data.password ? { password: await hash(data.password, 10) } : {}),
        }
      })

      if (existing.role === "GURU") {
        await tx.teacher.updateMany({
          where: { user_id: id },
          data: {
            ...(data.name !== undefined ? { nama_lengkap: data.name } : {}),
            ...(data.email !== undefined ? { email: data.email.toLowerCase() } : {}),
            ...(data.nip !== undefined ? { nip: data.nip || undefined } : {}),
          }
        })
      } else if (existing.role === "SISWA") {
        await tx.student.updateMany({
          where: { user_id: id },
          data: {
            ...(data.name !== undefined ? { nama_lengkap: data.name } : {}),
            ...(data.nisn !== undefined ? { nisn: data.nisn || undefined, nis: data.nisn || undefined } : {}),
          }
        })
      }
      return user
    })

    return toUser(result)
  },

  async remove(id: number): Promise<boolean> {
    await userRepository.delete(id)
    return true
  },
}
