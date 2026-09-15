import "server-only"
import { NextRequest } from "next/server"
import { apiError, ok } from "@/lib/api-utils"
import { requireApiUser, assertTeachingClassAccess } from "@/auth/api-authorization"
import { uploadFileToDrive } from "@/lib/storage/google-drive"
import path from "path"

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
  'application/zip',
  'application/x-zip-compressed'
]

const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.sh', '.js', '.ts', '.php']
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB limit

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")

    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const kelas_mengajar_id = formData.get("kelas_mengajar_id") as string | null

    if (!file || !kelas_mengajar_id) {
      return apiError(new Error("Missing required parameters: file, kelas_mengajar_id"), 400)
    }

    // 1. Validate Access
    await assertTeachingClassAccess(user, Number(kelas_mengajar_id))

    // 2. Validate File Type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return apiError(new Error(`File type ${file.type} is not allowed.`), 400)
    }

    const ext = path.extname(file.name).toLowerCase()
    if (BLOCKED_EXTENSIONS.includes(ext) || !ext) {
      return apiError(new Error(`File extension ${ext} is not allowed.`), 400)
    }

    if (file.size > MAX_FILE_SIZE) {
      return apiError(new Error("File size exceeds the limit of 20MB."), 400)
    }

    // 3. Generate secure filename
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const finalFilename = `assignment_${kelas_mengajar_id}_${Date.now()}_${safeName}`

    // 4. Upload langsung ke GDrive dari server (tidak lewat browser, menghindari CORS)
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const { fileId } = await uploadFileToDrive(finalFilename, file.type, buffer)

    return ok({ fileId })
  } catch (error) {
    return apiError(error)
  }
}
