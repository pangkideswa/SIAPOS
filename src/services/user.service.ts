import "server-only"
import { hash } from "bcryptjs"
import { userRepository } from "@/repositories/user.repository"
import { toUser, toRole } from "@/lib/db-mappers"
import type { User, UserRole } from "@/types/auth"

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
    const user = await userRepository.create({
      name: data.name,
      username: data.username ?? null,
      email: data.email.toLowerCase(),
      password: hashed,
      role: toRole(data.role),
      nip: data.nip ?? null,
      nisn: data.nisn ?? null,
    })
    return toUser(user)
  },

  async update(id: number, data: UpdateUserInput): Promise<User | null> {
    const user = await userRepository.update(id, {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.username !== undefined ? { username: data.username } : {}),
      ...(data.email !== undefined ? { email: data.email.toLowerCase() } : {}),
      ...(data.role !== undefined ? { role: toRole(data.role) } : {}),
      ...(data.nip !== undefined ? { nip: data.nip } : {}),
      ...(data.nisn !== undefined ? { nisn: data.nisn } : {}),
      ...(data.password ? { password: await hash(data.password, 10) } : {}),
    })
    return user ? toUser(user) : null
  },

  async remove(id: number): Promise<boolean> {
    await userRepository.delete(id)
    return true
  },
}
