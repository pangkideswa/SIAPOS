import { NextRequest, NextResponse } from "next/server"
import { studentImportExportService } from "@/services/student.import-export.service"
import { ok, unauthorized, apiError } from "@/lib/api-utils"
import { getCurrentUser } from "@/auth/session"

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
      return unauthorized("Anda tidak memiliki akses ke fitur ini")
    }

    const body = await request.json()
    if (!Array.isArray(body)) {
      return NextResponse.json({ message: "Format data tidak valid, harus berupa array" }, { status: 400 })
    }

    if (body.length === 0) {
      return NextResponse.json({ message: "Data kosong" }, { status: 400 })
    }

    const count = await studentImportExportService.executeImport(body)

    return ok({ count }, `${count} data siswa berhasil diimpor`)
  } catch (error) {
    console.error("Import execute error:", error)
    return apiError(error)
  }
}
