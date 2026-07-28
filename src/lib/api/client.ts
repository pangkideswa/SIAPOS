import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from "@/types/auth"
import { env } from "@/lib/config/env"

class ApiClient {
  private baseUrl: string

  constructor() {
    this.baseUrl = env.API_URL
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getToken()
    const headers: Record<string, string> = {
      Accept: "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const isFormData = options.body instanceof FormData
    if (!isFormData) {
      headers["Content-Type"] = "application/json"
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    })

    const json = await response.json()

    if (!response.ok) {
      throw {
        message: json.message ?? "Terjadi kesalahan",
        errors: json.errors,
        status: response.status,
      }
    }

    return json.data as T
  }

  async login(payload: LoginRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async register(payload: RegisterRequest): Promise<AuthResponse> {
    return this.request<AuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    })
  }

  async logout(): Promise<void> {
    await this.request("/auth/logout", { method: "POST" })
  }

  async getUser(): Promise<User> {
    return this.request<User>("/auth/user")
  }
}

export const apiClient = new ApiClient()
