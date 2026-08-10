import { NextRequest } from "next/server"
import { studentImportExportService } from "@/services/student.import-export.service"
import { unauthorized, apiError } from "@/lib/api-utils"
import { getCurrentUser } from "@/auth/session"

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
      return unauthorized("Anda tidak memiliki akses ke fitur ini")
    }

    const { searchParams } = new URL(request.url)
    const search = searchParams.get("search") || undefined
    const jurusan_id = searchParams.has("jurusan_id")
      ? Number(searchParams.get("jurusan_id"))
      : undefined
    const kelas = searchParams.get("kelas") || undefined
    const status = searchParams.get("status") || undefined

    const buffer = await studentImportExportService.exportToExcel({
      search,
      jurusan_id,
      kelas,
      status,
    })

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="data-siswa-${new Date().toISOString().split("T")[0]}.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Export error:", error)
    return apiError(error)
  }
}
