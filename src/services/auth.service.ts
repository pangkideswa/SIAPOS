import "server-only"
import { compare, hash } from "bcryptjs"
import { userRepository } from "@/repositories/user.repository"
import { toUser } from "@/lib/db-mappers"
import { AppError, NotFoundError } from "@/lib/api-utils"
import type { User, UserRole } from "@/types/auth"
import { prisma } from "@/lib/prisma"

interface RegisterInput {
  name: string
  email: string
  password: string
  role: UserRole
  nip?: string | null
  nisn?: string | null
  username?: string | null
}

interface GoogleLoginInput {
  email: string
  name?: string | null
  image?: string | null
  providerId?: string | null
}

export const authService = {
  async validateCredentials(
    identifier: string,
    password: string
  ): Promise<User | null> {
    const user = await userRepository.findByIdentifier(identifier)
    if (!user) return null
    if (!user.password) return null
    const valid = await compare(password, user.password)
    if (!valid) return null
    return toUser(user)
  },

  async register(data: RegisterInput): Promise<User> {
    if (data.role !== "siswa") {
      throw new AppError("Pendaftaran publik hanya diizinkan untuk siswa.", 403)
    }

    const existing = await userRepository.findFirst({
      OR: [{ email: data.email.toLowerCase() }, { username: data.username ?? undefined }],
    })
    if (existing) {
      throw new AppError("Email atau username sudah terdaftar", 422)
    }
    const hashed = await hash(data.password, 10)
    
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: data.name,
          email: data.email.toLowerCase(),
          password: hashed,
          role: "SISWA",
          username: data.username ?? null,
          nip: data.nip ?? null,
          nisn: data.nisn ?? null,
        }
      })

      await tx.student.create({
        data: {
          user_id: user.id,
          nama_lengkap: user.name,
          nis: user.nisn || `NIS-${Date.now()}`,
          nisn: user.nisn || `NISN-${Date.now()}`,
        }
      })

      return user
    })

    return toUser(result)
  },

  async getUserById(id: number): Promise<User | null> {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError("Pengguna tidak ditemukan")
    return toUser(user)
  },

  async changePassword(
    id: number,
    oldPassword: string,
    newPassword: string
  ): Promise<void> {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError("Pengguna tidak ditemukan")
    if (!user.password) {
      throw new AppError("Password lama tidak sesuai", 400)
    }
    const valid = await compare(oldPassword, user.password)
    if (!valid) {
      throw new AppError("Password lama tidak sesuai", 400)
    }
    const hashed = await hash(newPassword, 10)
    await userRepository.update(id, { password: hashed })
  },

  async updateProfile(
    id: number,
    data: {
      name: string
      email: string
      nip?: string | null
      nisn?: string | null
    }
  ): Promise<User> {
    const user = await userRepository.findById(id)
    if (!user) throw new NotFoundError("Pengguna tidak ditemukan")
    const updated = await userRepository.update(id, {
      name: data.name,
      email: data.email.toLowerCase(),
      ...(data.nip !== undefined ? { nip: data.nip } : {}),
      ...(data.nisn !== undefined ? { nisn: data.nisn } : {}),
    })
    if (!updated) throw new NotFoundError("Pengguna tidak ditemukan")
    return toUser(updated)
  },

  async googleLogin(data: GoogleLoginInput): Promise<User> {
    const email = data.email.trim().toLowerCase()
    const user = await userRepository.findFirst({ email })
    if (!user) {
      throw new AppError("Akun belum terdaftar.", 404)
    }
    await userRepository.update(user.id, {
      provider: "google",
      providerId: data.providerId ?? null,
      image: data.image ?? user.image,
      emailVerified: user.emailVerified ?? new Date(),
    })
    return toUser(user)
  },
}
