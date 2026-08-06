import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/auth/config"
import type { UserRole } from "@/types/auth"

const ROLE_ROUTES: { prefix: string; roles: UserRole[] }[] = [
  { prefix: "/admin", roles: ["super_admin", "admin"] },
  { prefix: "/guru", roles: ["guru"] },
  { prefix: "/siswa", roles: ["siswa"] },
  { prefix: "/wali", roles: ["wali"] },
]

const AUTH_PAGES = ["/masuk", "/daftar", "/login", "/register"]
const AUTHENTICATED_ONLY = ["/forbidden"]

function getDashboardPath(role?: string): string {
  switch (role) {
    case "super_admin":
    case "admin":
      return "/admin"
    case "guru":
      return "/guru"
    case "siswa":
      return "/siswa"
    case "wali":
      return "/wali"
    default:
      return "/masuk"
  }
}

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/icons") ||
    pathname.includes(".")
  )
}

export default NextAuth(authConfig).auth((req) => {
  const { pathname } = req.nextUrl
  if (isStaticAsset(pathname)) return NextResponse.next()

  const session = req.auth
  const role = session?.user?.role
  const isAuthPage = AUTH_PAGES.includes(pathname)

  if (!session?.user?.id) {
    if (isAuthPage || pathname === "/") return NextResponse.next()
    const loginUrl = new URL("/masuk", req.url)
    loginUrl.searchParams.set("redirect", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthPage) {
    return NextResponse.redirect(
      new URL(getDashboardPath(role), req.url)
    )
  }

  if (AUTHENTICATED_ONLY.includes(pathname)) {
    return NextResponse.next()
  }

  const rule = ROLE_ROUTES.find(
    (r) => pathname === r.prefix || pathname.startsWith(r.prefix + "/")
  )
  if (rule && !rule.roles.includes(role as UserRole)) {
    return NextResponse.redirect(new URL("/forbidden", req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|ico|webp)$).*)",
  ],
}
