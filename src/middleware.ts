import NextAuth from "next-auth"
import { NextResponse } from "next/server"
import { authConfig } from "@/auth/config"
import type { UserRole } from "@/types/auth"
import { LRUCache } from "lru-cache"

const rateLimitCache = new LRUCache<string, { count: number; expiresAt: number }>({
  max: 500, // Maximum number of IPs to track
  ttl: 60000, // 1 minute max TTL
})

function applyRateLimit(ip: string, pathname: string): boolean {
  const now = Date.now()
  let limit = 100 // default max requests
  let windowMs = 10000 // 10 seconds

  if (pathname.startsWith("/api/auth")) {
    limit = 10
    windowMs = 60000 // 1 min
  } else if (pathname.includes("/upload-url")) {
    limit = 20
    windowMs = 60000 // 1 min
  } else if (!pathname.startsWith("/api")) {
    return true // only limit APIs for now
  }

  const key = `${ip}:${pathname.split('/')[2] || 'global'}`
  const entry = rateLimitCache.get(key)

  if (!entry || now > entry.expiresAt) {
    rateLimitCache.set(key, { count: 1, expiresAt: now + windowMs })
    return true
  }

  entry.count++
  rateLimitCache.set(key, entry)
  if (entry.count > limit) return false
  return true
}

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
  
  // Rate Limiting harus dijalankan SEBELUM isStaticAsset
  // karena isStaticAsset mengabaikan /api
  if (!pathname.startsWith("/_next") && !pathname.includes(".")) {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1"
    if (!applyRateLimit(ip, pathname)) {
      return new NextResponse("Too Many Requests", { status: 429 })
    }
  }

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
