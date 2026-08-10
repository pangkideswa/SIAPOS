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

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ message: "File tidak ditemukan" }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    
    const result = await studentImportExportService.validateImport(buffer)

    return ok(result, "Validasi selesai")
  } catch (error) {
    console.error("Import validate error:", error)
    return apiError(error)
  }
}
