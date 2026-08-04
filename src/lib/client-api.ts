export interface ApiClientError {
  message: string
  status: number
  errors?: Record<string, string[]>
}

export async function apiFetch<T = unknown>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    Accept: "application/json",
    ...(options.headers as Record<string, string>),
  }

  const isFormData = options.body instanceof FormData
  if (!isFormData && options.body !== undefined) {
    headers["Content-Type"] = "application/json"
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  const json = await response.json().catch(() => null)

  if (!response.ok) {
    const error: ApiClientError = {
      message:
        (json as { message?: string } | null)?.message ??
        "Terjadi kesalahan",
      status: response.status,
      errors: (json as { errors?: Record<string, string[]> } | null)?.errors,
    }
    throw error
  }

  return (json as { data?: T })?.data as T
}
