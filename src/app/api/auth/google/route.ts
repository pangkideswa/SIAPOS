import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: "Email wajib diisi" },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { teacher: true, student: true },
    })

    if (!user) {
      return NextResponse.json(
        {
          error: "Akun tidak terdaftar",
          message:
            "Akun Anda belum terdaftar di SIAPOS. Silakan hubungi Administrator.",
        },
        { status: 404 }
      )
    }

    const roleMap: Record<string, string> = {
      SUPER_ADMIN: "super_admin",
      ADMIN: "admin",
      TEACHER: "guru",
      STUDENT: "siswa",
      WALI: "wali",
    }

    return NextResponse.json({
      user_id: user.id,
      name: user.name,
      email: user.email,
      role: roleMap[user.role] ?? user.role.toLowerCase(),
    })
  } catch (error) {
    console.error("Google auth error:", error)
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    )
  }
}
