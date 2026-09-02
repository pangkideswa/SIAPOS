import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { apiError } from "@/lib/api-utils"
import { requireApiUser, assertSubmissionAccess } from "@/auth/api-authorization"
import { submissionService } from "@/services/submission.service"
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

    if (storagePath.includes("/")) {
      // Legacy Supabase Storage (path contains a slash e.g. "submissions/...")
      try {
        const link = await createSignedUrl(BUCKETS.SUBMISSIONS, storagePath, 60 * 60) // 1 hour
        return NextResponse.redirect(link)
      } catch (e: any) {
         console.warn("Supabase signed url failed, falling back to public url for legacy file", e)
         const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
         if (!supabaseUrl) throw new Error("Missing Supabase URL")
         const finalUrl = `${supabaseUrl}/storage/v1/object/public/${BUCKETS.SUBMISSIONS}/${storagePath}`
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
