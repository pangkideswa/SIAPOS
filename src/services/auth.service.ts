import "server-only"
import { compare, hash } from "bcryptjs"
import { userRepository } from "@/repositories/user.repository"
import { toUser, toRole } from "@/lib/db-mappers"
import { signToken } from "@/lib/auth-token"
import { AppError, NotFoundError } from "@/lib/api-utils"
import type { User, UserRole } from "@/types/auth"

export interface AuthLoginResult {
  user: User
  token: string
}

interface RegisterInput {
  name: string
  email: string
  password: string
  role: UserRole
  nip?: string | null
  nisn?: string | null
  username?: string | null
}

export const authService = {
  async login(identifier: string, password: string): Promise<AuthLoginResult> {
    const user = await userRepository.findByIdentifier(identifier)
    if (!user) {
      throw new AppError("Email, NIP/NISN, atau kata sandi salah", 401)
    }
    const valid = await compare(password, user.password)
    if (!valid) {
      throw new AppError("Email, NIP/NISN, atau kata sandi salah", 401)
    }
    const publicUser = toUser(user)
    const token = signToken({ sub: user.id, role: user.role })
    return { user: publicUser, token }
  },

  async register(data: RegisterInput): Promise<AuthLoginResult> {
    const existing = await userRepository.findFirst({
      OR: [{ email: data.email.toLowerCase() }, { username: data.username ?? undefined }],
    })
    if (existing) {
      throw new AppError("Email atau username sudah terdaftar", 422)
    }
    const hashed = await hash(data.password, 10)
    const user = await userRepository.create({
      name: data.name,
      email: data.email.toLowerCase(),
      password: hashed,
      role: toRole(data.role),
      username: data.username ?? null,
      nip: data.nip ?? null,
      nisn: data.nisn ?? null,
    })
    const publicUser = toUser(user)
    const token = signToken({ sub: user.id, role: user.role })
    return { user: publicUser, token }
  },

  async getUserById(id: number): Promise<User | null> {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError("Pengguna tidak ditemukan")
    return toUser(user)
  },

  async logout(): Promise<boolean> {
    return true
  },
}
