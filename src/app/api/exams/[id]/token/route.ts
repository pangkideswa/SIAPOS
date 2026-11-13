import "server-only"
import { NextRequest } from "next/server"
import { ok, apiError } from "@/lib/api-utils"
import { requireApiUser } from "@/auth/api-authorization"
import { prisma } from "@/lib/prisma"

// Character set without confusing letters (0, O, 1, I)
const TOKEN_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"

function generateToken(length = 6): string {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += TOKEN_CHARS.charAt(Math.floor(Math.random() * TOKEN_CHARS.length))
  }
  return result
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await requireApiUser("super_admin", "admin", "guru")

    const examId = Number(id)
    if (isNaN(examId)) return apiError(new Error("ID ujian tidak valid"), 400)

    const exam = await prisma.exam.findUnique({
      where: { id: examId },
      select: { id: true, token: true, judul: true },
    })

    if (!exam) return apiError(new Error("Ujian tidak ditemukan"), 404)

    return ok({ token: exam.token }, "Token ujian berhasil diambil")
  } catch (error) {
    return apiError(error)
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await requireApiUser("super_admin", "admin", "guru")

    const examId = Number(id)
    if (isNaN(examId)) return apiError(new Error("ID ujian tidak valid"), 400)

    const body = await request.json()
    const { action, custom_token } = body

    let nextToken: string | null = null

    if (action === "remove") {
      nextToken = null
    } else if (action === "custom" && custom_token) {
      nextToken = String(custom_token).trim().toUpperCase()
    } else {
      // Default: generate random 6-character token
      nextToken = generateToken(6)
    }

    const updated = await prisma.exam.update({
      where: { id: examId },
      data: { token: nextToken },
      select: { id: true, token: true },
    })

    return ok(
      { token: updated.token },
      nextToken ? `Token ujian berhasil dirilis: ${nextToken}` : "Token ujian berhasil dinonaktifkan"
    )
  } catch (error) {
    return apiError(error)
  }
}

