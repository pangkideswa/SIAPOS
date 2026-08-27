import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { submissionService } from "@/services/submission.service"
import { requireApiUser, assertSubmissionAccess } from "@/auth/api-authorization"
import { createSignedUrl, BUCKETS } from "@/lib/storage/supabase-server"
import { apiError, notFound } from "@/lib/api-utils"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    const submissionId = Number(id)
    
    // 1. Authorization
    await assertSubmissionAccess(user, submissionId)
    
    const storagePath = request.nextUrl.searchParams.get("path")
    if (!storagePath) {
      return apiError(new Error("Missing path parameter"), 400)
    }

    if (storagePath.includes("../") || storagePath.includes("..\\")) {
       return apiError(new Error("Invalid path"), 400)
    }

    // 2. Load submission
    const submission = await submissionService.getById(submissionId)
    if (!submission) {
      return notFound("Submission tidak ditemukan")
    }

    // 3. Security Check: verify requested path exactly matches DB
    const actualPath = submission.file_jawaban?.storage_path
    if (!actualPath || actualPath !== storagePath) {
       return apiError(new Error("Storage path mismatch. Access denied."), 403)
    }

    if (!storagePath.includes("/")) {
      const { getWebViewLink } = await import("@/lib/storage/google-drive")
      const link = await getWebViewLink(storagePath)
      return NextResponse.redirect(link)
    }

    // 4. Generate signed URL for legacy Supabase Storage
    try {
      const signedUrl = await createSignedUrl(BUCKETS.SUBMISSIONS, storagePath, 3600)
      return NextResponse.redirect(signedUrl)
    } catch (err: any) {
      if (err.message?.includes("Object not found") || err.message?.includes("NoSuchKey")) {
        return apiError(new Error("File tidak ditemukan di server penyimpanan"), 404)
      }
      throw err
    }
  } catch (error) {
    return apiError(error)
  }
}
