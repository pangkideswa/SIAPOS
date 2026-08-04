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
import { findDemoUser } from "@/lib/demo-users"
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
    const raw = localStorage.getItem("demo_user")
    if (!raw) return null
    return JSON.parse(raw) as User
  } catch {
    return null
  }
}

function setDemoCookie(value: string) {
  document.cookie = `demo_token=${value}; path=/; max-age=86400; SameSite=Lax`
}

function removeDemoCookie() {
  document.cookie = "demo_token=; path=/; max-age=0"
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

function isServerError(error: unknown): boolean {
  if (error && typeof error === "object" && "status" in error) {
    return (error as { status: number }).status >= 500
  }
  return true
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

    const storedUser = getInitialUser()
    setUser(storedUser)
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (isLoading) return

    if (!isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/masuk")
    }
  }, [isLoading, isAuthenticated, pathname, router])

  const login = useCallback(
    async (identifier: string, password: string) => {
      let foundUser: User | null = null

      try {
        const result = await apiFetch<AuthResponse>("/api/auth/login", {
          method: "POST",
          body: JSON.stringify({ identifier, password }),
        })
        foundUser = result.user
      } catch {
        foundUser = findDemoUser(identifier, password)
      }

      if (!foundUser) {
        throw new Error("Email atau kata sandi salah")
      }

      localStorage.setItem("demo_user", JSON.stringify(foundUser))
      setDemoCookie("demo-authenticated")
      setUser(foundUser)

      const dashboard = getDashboardPath(foundUser.role)
      router.push(dashboard)
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

        localStorage.setItem("demo_user", JSON.stringify(result.user))
        setDemoCookie("demo-authenticated")
        setUser(result.user)
        router.push(getDashboardPath(result.user.role))
        return
      } catch (error) {
        if (!isServerError(error)) {
          throw error
        }
      }

      const newUser: User = {
        id: Date.now(),
        name,
        email,
        role,
        nip: role === "guru" ? (nip ?? null) : null,
        nisn: role === "siswa" ? (nisn ?? null) : null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }

      localStorage.setItem("demo_user", JSON.stringify(newUser))
      setDemoCookie("demo-authenticated")
      setUser(newUser)

      const dashboard = getDashboardPath(newUser.role)
      router.push(dashboard)
    },
    [router]
  )

  const logout = useCallback(async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
    } catch {
      // ignore logout API errors
    }
    localStorage.removeItem("demo_user")
    removeDemoCookie()
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
