"use client"

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { signOut as nextAuthSignOut } from "next-auth/react"
import { apiFetch } from "@/lib/client-api"
import type { User, UserRole, AuthResponse } from "@/types/auth"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (identifier: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    passwordConfirmation: string,
    role: "guru" | "siswa" | "wali",
    nip?: string,
    nisn?: string
  ) => Promise<void>
  logout: () => Promise<void>
  hasRole: (...roles: UserRole[]) => boolean
}

const AuthContext = createContext<AuthContextType | null>(null)

const PUBLIC_ROUTES = ["/", "/masuk", "/daftar", "/login", "/register"]

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null
  try {
    const raw = localStorage.getItem("siapos_user")
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function cacheUser(user: User | null) {
  if (typeof window === "undefined") return
  try {
    if (user) {
      localStorage.setItem("siapos_user", JSON.stringify(user))
    } else {
      localStorage.removeItem("siapos_user")
    }
  } catch {
    // ignore storage errors
  }
}

function getDashboardPath(role: UserRole): string {
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

function getErrorStatus(error: unknown): number | null {
  if (error && typeof error === "object" && "status" in error) {
    return (error as { status: number }).status
  }
  return null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const mountedRef = useRef(false)

  const isAuthenticated = !!user

  const hasRole = useCallback(
    (...roles: UserRole[]) => {
      if (!user) return false
      return roles.includes(user.role)
    },
    [user]
  )

  useEffect(() => {
    if (mountedRef.current) return
    mountedRef.current = true

    let cancelled = false

    async function loadUser() {
      try {
        const serverUser = await apiFetch<User>("/api/auth/user")
        if (cancelled) return
        setUser(serverUser)
        cacheUser(serverUser)
      } catch (error) {
        if (cancelled) return
        const status = getErrorStatus(error)
        if (status === 401) {
          cacheUser(null)
          setUser(null)
        } else {
          const cached = getInitialUser()
          if (cached) setUser(cached)
        }
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadUser()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/masuk")
    }
  }, [isLoading, isAuthenticated, pathname, router])

  const login = useCallback(
    async (identifier: string, password: string) => {
      try {
        const result = await apiFetch<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ identifier, password }),
        })
        cacheUser(result.user)
        setUser(result.user)
        router.push(getDashboardPath(result.user.role))
      } catch (error) {
        if (getErrorStatus(error) === null) {
          throw new Error("Tidak dapat terhubung ke server. Silakan coba lagi.")
        }
        throw error
      }
    },
    [router]
  )

  const register = useCallback(
    async (
      name: string,
      email: string,
      password: string,
      passwordConfirmation: string,
      role: "guru" | "siswa" | "wali",
      nip?: string,
      nisn?: string
    ) => {
      try {
        const result = await apiFetch<AuthResponse>("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            role,
            nip,
            nisn,
          }),
        })
        cacheUser(result.user)
        setUser(result.user)
        router.push(getDashboardPath(result.user.role))
      } catch (error) {
        if (getErrorStatus(error) === null) {
          throw new Error("Tidak dapat terhubung ke server. Silakan coba lagi.")
        }
        throw error
      }
    },
    [router]
  )

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore logout API errors
    }
    try {
      await nextAuthSignOut({ redirect: false })
    } catch {
      // ignore next-auth sign-out errors
    }
    cacheUser(null)
    setUser(null)
    router.push("/masuk")
  }, [router])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth harus digunakan dalam AuthProvider")
  }
  return context
}
