import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { apiError } from "@/lib/api-utils"
import { requireApiUser, assertAssignmentAccess } from "@/auth/api-authorization"
import { assignmentService } from "@/services/assignment.service"
import { getWebViewLink } from "@/lib/storage/google-drive"
import { createSignedUrl, BUCKETS } from "@/lib/storage/supabase-server"
import { notFound } from "@/lib/api-utils"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    const assignmentId = Number(id)
    
    // 1. Authorization
    await assertAssignmentAccess(user, assignmentId)
    
    const storagePath = request.nextUrl.searchParams.get("path")
    if (!storagePath) {
      return apiError(new Error("Missing path parameter"), 400)
    }

    if (storagePath.includes("../") || storagePath.includes("..\\")) {
       return apiError(new Error("Invalid path"), 400)
    }

    // 2. Load assignment
    const assignment = await assignmentService.getById(assignmentId)
    if (!assignment) {
      return notFound("Assignment tidak ditemukan")
    }

    // 3. Security Check: verify requested path exactly matches one of the attachments
    const isPathValid = assignment.lampiran?.some(l => l.storage_path === storagePath)
    if (!isPathValid) {
       return apiError(new Error("Storage path mismatch. Access denied."), 403)
    }

    if (storagePath.includes("/")) {
      // Legacy Supabase Storage (path contains a slash e.g. "assignments/...")
      try {
        const link = await createSignedUrl(BUCKETS.ASSIGNMENTS, storagePath, 60 * 60) // 1 hour
        return NextResponse.redirect(link)
      } catch (e) {
         console.warn("Supabase signed url failed, falling back to public url for legacy file", e)
         const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
         if (!supabaseUrl) throw new Error("Missing Supabase URL")
         const finalUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKETS.ASSIGNMENTS}/${storagePath}`
         return NextResponse.redirect(finalUrl)
      }
    } else {
      // Google Drive (path is an ID without slashes)
      const webViewLink = await getWebViewLink(storagePath)
      if (!webViewLink) {
         return apiError(new Error("Failed to get file link"), 500)
      }
      return NextResponse.redirect(webViewLink)
    }
  } catch (error) {
    return apiError(error)
  }
}
