import type { NextAuthConfig } from "next-auth"
import type { UserRole } from "@/types/auth"
import { mapRole } from "@/lib/db-mappers"

const SESSION_MAX_AGE = 60 * 60 * 24 * 7

const CANONICAL_ROLES: UserRole[] = [
  "super_admin",
  "admin",
  "guru",
  "siswa",
  "wali",
]

function normalizeRole(role: unknown): UserRole | undefined {
  if (typeof role !== "string" || !role) return undefined
  if (CANONICAL_ROLES.includes(role as UserRole)) return role as UserRole
  return mapRole(role)
}

const secret =
  process.env.AUTH_SECRET ??
  process.env.NEXTAUTH_SECRET ??
  (process.env.NODE_ENV === "production"
    ? (() => {
        throw new Error("AUTH_SECRET wajib diisi di environment production")
      })()
    : "dev-secret-change-me-in-production")

const useSecureCookies = process.env.NODE_ENV === "production"
const cookiePrefix = useSecureCookies ? "__Secure-" : ""

export const authConfig = {
  secret,
  trustHost: true,
  useSecureCookies,
  cookies: {
    sessionToken: {
      name: `${cookiePrefix}authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: useSecureCookies,
      },
    },
  },
  providers: [],
  session: {
    strategy: "jwt",
    maxAge: SESSION_MAX_AGE,
  },
  pages: {
    signIn: "/masuk",
    error: "/masuk",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.sub = user.id?.toString() ?? token.sub
        const role = normalizeRole((user as { role?: unknown }).role)
        if (role) token.role = role
      }
      return token
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub as string) ?? session.user.id ?? ""
        session.user.role = (token.role as UserRole) ?? "siswa"
        session.user.name =
          session.user.name ?? (token.name as string | undefined) ?? ""
        session.user.email =
          session.user.email ?? (token.email as string | undefined) ?? ""
        session.user.image =
          session.user.image ??
          (token.picture as string | undefined) ??
          null
      }
      return session
    },
  },
} satisfies NextAuthConfig
