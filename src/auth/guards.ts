import "server-only"
import { getCurrentRole, getCurrentUser, type SessionUser } from "@/auth/session"
import { AppError } from "@/lib/api-utils"
import type { UserRole } from "@/types/auth"

export async function hasRole(...roles: UserRole[]): Promise<boolean> {
  const role = await getCurrentRole()
  return role !== null && roles.includes(role)
}

export async function requireRole(
  ...roles: UserRole[]
): Promise<SessionUser> {
  const user = await getCurrentUser()
  if (!user) {
    throw new AppError("Tidak terautentikasi", 401)
  }
  if (!roles.includes(user.role)) {
    throw new AppError("Anda tidak memiliki akses ke sumber daya ini", 403)
  }
  return user
}
