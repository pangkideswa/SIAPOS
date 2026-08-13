import "server-only"
import { NextRequest } from "next/server"
import { apiError, ok } from "@/lib/api-utils"
import { requireAdmin } from "@/auth/api-authorization"
import { createSignedUploadUrl, BUCKETS } from "@/lib/storage/supabase-server"
import path from "path"
import crypto from "crypto"

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2MB

export async function POST(request: NextRequest) {
  try {
    const user = await requireAdmin() // only admin can update student avatars
    const body = await request.json()
    
    const { filename, contentType, size, studentId } = body
    
    if (!filename || !contentType || !size) {
       return apiError(new Error("Missing required parameters"), 400)
    }

    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
       return apiError(new Error(`File type ${contentType} is not allowed.`), 400)
    }

    const ext = path.extname(filename).toLowerCase()
    if (!ext || ['.exe', '.bat', '.cmd', '.sh', '.js'].includes(ext)) {
       return apiError(new Error(`File extension ${ext} is not allowed.`), 400)
    }

    if (size > MAX_FILE_SIZE) {
       return apiError(new Error("File size exceeds the limit of 2MB."), 400)
    }

    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const namespace = studentId ? String(studentId) : `temp-${crypto.randomUUID()}`
    const storagePath = `students/${namespace}/avatar-${Date.now()}${ext}`
    
    const uploadData = await createSignedUploadUrl(BUCKETS.AVATARS, storagePath)

    return ok({
       uploadUrl: uploadData.signedUrl,
       storagePath,
       token: uploadData.token
    })
  } catch (error) {
    return apiError(error)
  }
}
