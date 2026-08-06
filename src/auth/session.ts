import "server-only"
import { auth } from "@/auth"
import type { Session } from "next-auth"
import type { UserRole } from "@/types/auth"

export interface SessionUser {
  id: number
  role: UserRole
  name: string
  email: string
  image: string | null
}

export async function getCurrentSession(): Promise<Session | null> {
  return auth()
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth()
  const id = session?.user?.id
  const role = session?.user?.role
  if (!id || !role) return null
  return {
    id: Number(id),
    role: role as UserRole,
    name: session.user.name ?? "",
    email: session.user.email ?? "",
    image: session.user.image ?? null,
  }
}

export async function getCurrentRole(): Promise<UserRole | null> {
  const user = await getCurrentUser()
  return user?.role ?? null
}
