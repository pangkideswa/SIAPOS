import "server-only"
import { NextRequest } from "next/server"
import { apiError, ok } from "@/lib/api-utils"
import { requireApiUser, assertAssignmentAccess, getStudentId } from "@/auth/api-authorization"
import { createResumableUpload } from "@/lib/storage/google-drive"
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
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB limit for students

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("siswa")
    const body = await request.json()
    
    const { assignment_id, student_id, filename, contentType, size } = body
    
    if (!assignment_id || !student_id || !filename || !contentType || !size) {
       return apiError(new Error("Missing required parameters"), 400)
    }

    // 1. Validate Access
    // For students, ensure they only upload for themselves
    const targetStudentId = Number(student_id)
    if (user.role === "siswa") {
       const userStudentId = await getStudentId(user)
       if (userStudentId !== targetStudentId) {
          return apiError(new Error("Unauthorized student upload access"), 403)
       }
    }
    
    await assertAssignmentAccess(user, Number(assignment_id))

    // 2. Validate File
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
       return apiError(new Error(`File type ${contentType} is not allowed.`), 400)
    }

    const ext = path.extname(filename).toLowerCase()
    if (BLOCKED_EXTENSIONS.includes(ext) || !ext) {
       return apiError(new Error(`File extension ${ext} is not allowed.`), 400)
    }

    if (size > MAX_FILE_SIZE) {
       return apiError(new Error("File size exceeds the limit of 5MB."), 400)
    }

    // 3. Generate secure path
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const finalFilename = `submission_${targetStudentId}_${assignment_id}_${Date.now()}_${safeName}`
    
    // 4. Generate GDrive Resumable Upload URL
    const origin = request.headers.get("origin")
    const { uploadUrl } = await createResumableUpload(finalFilename, contentType, size, origin)

    return ok({
       uploadUrl: uploadUrl,
       storagePath: "", // Will be assigned by frontend from GDrive response
       token: "" // Token is included in the uploadUrl for GDrive
    })
  } catch (error) {
    return apiError(error)
  }
}
