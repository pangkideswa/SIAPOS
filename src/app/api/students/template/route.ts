
import { studentImportExportService } from "@/services/student.import-export.service"
import { unauthorized, apiError } from "@/lib/api-utils"
import { getCurrentUser } from "@/auth/session"

export async function GET() {
  try {
    const user = await getCurrentUser()
    if (!user || (user.role !== "super_admin" && user.role !== "admin")) {
      return unauthorized("Anda tidak memiliki akses ke fitur ini")
    }

    const buffer = studentImportExportService.generateTemplate()

    return new Response(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="template-data-siswa.xlsx"`,
      },
    })
  } catch (error) {
    console.error("Template error:", error)
    return apiError(error)
  }
}
