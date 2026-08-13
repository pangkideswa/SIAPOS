import "server-only"
import { NextRequest } from "next/server"
import { apiError, ok } from "@/lib/api-utils"
import { requireApiUser, assertTeachingClassAccess } from "@/auth/api-authorization"
import { createSignedUploadUrl, BUCKETS } from "@/lib/storage/supabase-server"
import path from "path"

const ALLOWED_MIME_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/svg+xml',
  'application/pdf', 'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain'
]

const BLOCKED_EXTENSIONS = ['.exe', '.bat', '.cmd', '.ps1', '.sh', '.js', '.ts', '.php']
const MAX_FILE_SIZE = 20 * 1024 * 1024 // 20MB

export async function POST(request: NextRequest) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const body = await request.json()
    
    const { filename, contentType, size, kelas_mengajar_id, materialId } = body
    
    if (!filename || !contentType || !size || !kelas_mengajar_id) {
       return apiError(new Error("Missing required parameters"), 400)
    }

    // 1. Authorization for Class
    await assertTeachingClassAccess(user, Number(kelas_mengajar_id))

    // 2. Validation
    if (!ALLOWED_MIME_TYPES.includes(contentType)) {
       return apiError(new Error(`File type ${contentType} is not allowed.`), 400)
    }

    const ext = path.extname(filename).toLowerCase()
    if (BLOCKED_EXTENSIONS.includes(ext) || !ext) {
       return apiError(new Error(`File extension ${ext} is not allowed.`), 400)
    }

    if (size > MAX_FILE_SIZE) {
       return apiError(new Error("File size exceeds the limit of 20MB."), 400)
    }

    // 3. Generate secure path
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    let materialNamespace: string

    if (materialId) {
      // TEMUAN 1: Validate ownership of existing materialId before allowing its namespace
      const { materialService } = await import("@/services/material.service")
      const { assertMaterialAccess } = await import("@/auth/api-authorization")
      
      const existingMaterial = await materialService.getById(Number(materialId))
      if (!existingMaterial) {
         return apiError(new Error("Material not found"), 404)
      }
      // Re-assert access specifically to this material
      await assertMaterialAccess(user, Number(materialId))
      materialNamespace = String(materialId)
    } else {
      const crypto = await import("crypto")
      materialNamespace = `temp-${crypto.randomUUID()}`
    }
    
    const storagePath = `materials/${materialNamespace}/${Date.now()}-${safeName}`
    
    // 4. Generate signed upload URL
    const uploadData = await createSignedUploadUrl(BUCKETS.MATERIALS, storagePath)

    return ok({
       uploadUrl: uploadData.signedUrl,
       storagePath,
       token: uploadData.token
    })
  } catch (error) {
    return apiError(error)
  }
}
