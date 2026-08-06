import "server-only"
import { NextResponse } from "next/server"
import { ZodError, type ZodType } from "zod"
import { Prisma } from "@/generated/prisma/client"

// ============================================================================
// Application errors
// ============================================================================

export class AppError extends Error {
  readonly status: number
  readonly errors?: Record<string, string[]>

  constructor(
    message: string,
    status = 400,
    errors?: Record<string, string[]>
  ) {
    super(message)
    this.name = "AppError"
    this.status = status
    this.errors = errors
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Data tidak ditemukan") {
    super(message, 404)
    this.name = "NotFoundError"
  }
}

export class ValidationError extends AppError {
  constructor(error: ZodError) {
    super("Data yang dikirim tidak valid", 422, formatZodErrors(error))
    this.name = "ValidationError"
  }
}

function formatZodErrors(error: ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  for (const issue of error.issues) {
    const field = issue.path.join(".") || "form"
    if (!errors[field]) errors[field] = []
    errors[field].push(issue.message)
  }
  return errors
}

export function parseWithSchema<T>(schema: ZodType<T>, body: unknown): T {
  const result = schema.safeParse(body)
  if (!result.success) {
    throw new ValidationError(result.error)
  }
  return result.data
}

// ============================================================================
// Prisma error mapping (never expose stack traces / raw DB messages)
// ============================================================================

function mapPrismaError(error: unknown): { message: string; status: number } {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case "P2002":
        return {
          message: "Data sudah digunakan atau terdaftar sebelumnya",
          status: 409,
        }
      case "P2025":
        return { message: "Data tidak ditemukan", status: 404 }
      case "P2003":
        return { message: "Data masih terkait dengan data lain", status: 409 }
      case "P2000":
        return {
          message: "Nilai terlalu panjang untuk kolom database",
          status: 400,
        }
      case "P2014":
        return { message: "Relasi data tidak valid", status: 400 }
      default:
        return { message: "Terjadi kesalahan pada database", status: 500 }
    }
  }
  if (error instanceof Prisma.PrismaClientValidationError) {
    return { message: "Data yang dikirim tidak sesuai", status: 400 }
  }
  return { message: "Terjadi kesalahan pada database", status: 500 }
}

// ============================================================================
// Response helpers
// ============================================================================

export function ok<T>(data: T, message?: string) {
  return NextResponse.json({ data, message })
}

export function created<T>(data: T, message?: string) {
  return NextResponse.json({ data, message }, { status: 201 })
}

export function apiError(error: unknown, status = 500) {
  if (error instanceof ValidationError) {
    return NextResponse.json(
      { message: error.message, errors: error.errors },
      { status: error.status }
    )
  }
  if (error instanceof AppError) {
    return NextResponse.json({ message: error.message }, { status: error.status })
  }

  const prismaError = mapPrismaError(error)
  if (prismaError.status !== 500) {
    return NextResponse.json(
      { message: prismaError.message },
      { status: prismaError.status }
    )
  }

  // Unknown errors: log server-side, respond with a friendly generic message.
  console.error("[api-error]", error)
  return NextResponse.json(
    { message: "Terjadi kesalahan pada server" },
    { status }
  )
}

export function notFound(message = "Data tidak ditemukan") {
  return NextResponse.json({ message }, { status: 404 })
}

export function unauthorized(message = "Tidak terautentikasi") {
  return NextResponse.json({ message }, { status: 401 })
}

export function forbidden(message = "Anda tidak memiliki akses ke sumber daya ini") {
  return NextResponse.json({ message }, { status: 403 })
}
