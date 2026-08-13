import "server-only"
import { NextRequest } from "next/server"
import { apiError, ok } from "@/lib/api-utils"
import { requireApiUser, assertAssignmentAccess, getStudentId } from "@/auth/api-authorization"
import { createSignedUploadUrl, BUCKETS } from "@/lib/storage/supabase-server"
import path from "path"

const ALLOWED_MIME_TYPES = [
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip',
  'application/x-zip-compressed'
]

const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.sh', '.js', '.ts', '.php']
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB limit for submissions

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("siswa")
    const studentId = await getStudentId(user)
    
    if (!studentId) {
       return apiError(new Error("Hanya siswa yang dapat meminta URL upload submission"), 403)
    }

    const body = await request.json()
    const { filename, contentType, size, assignment_id } = body
    
    if (!filename || !contentType || !size || !assignment_id) {
       return apiError(new Error("Missing required parameters"), 400)
    }

    // 1. Authorization
    await assertAssignmentAccess(user, Number(assignment_id))

    // 2. Validation
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
    // Namespace format: submissions/{studentId}/{assignmentId}/{timestamp}-{safeFilename}
    const storagePath = `submissions/${studentId}/${assignment_id}/${Date.now()}-${safeName}`
    
    // 4. Generate signed upload URL
    const uploadData = await createSignedUploadUrl(BUCKETS.SUBMISSIONS, storagePath)

    return ok({
       uploadUrl: uploadData.signedUrl,
       storagePath,
       token: uploadData.token
    })
  } catch (error) {
    return apiError(error)
  }
}
