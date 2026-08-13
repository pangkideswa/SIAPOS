import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { apiError, notFound } from "@/lib/api-utils"
import { requireApiUser, assertAssignmentAccess } from "@/auth/api-authorization"
import { assignmentService } from "@/services/assignment.service"
import { BUCKETS } from "@/lib/storage/supabase-server"
import { getSupabaseAdmin } from "@/lib/storage/supabase-server"

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    const assignmentId = Number(id)
    
    const searchParams = request.nextUrl.searchParams
    const storagePath = searchParams.get('path')
    
    if (!storagePath) {
      return apiError(new Error("Missing path parameter"), 400)
    }

    // 1. Validate Access
    await assertAssignmentAccess(user, assignmentId)
    const assignment = await assignmentService.getById(assignmentId)
    if (!assignment) return notFound("Tugas tidak ditemukan")

    // 2. Validate Ownership of Path
    // Verify that the requested storage path is actually attached to this assignment
    const isAttached = assignment.lampiran.some(lamp => lamp.storage_path === storagePath)
    
    if (!isAttached) {
       return apiError(new Error("File is not attached to this assignment or unauthorized access"), 403)
    }

    // 3. Generate Signed Download URL (valid for 60 seconds)
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase.storage
       .from(BUCKETS.ASSIGNMENTS)
       .createSignedUrl(storagePath, 60, {
          download: true
       })

    if (error || !data?.signedUrl) {
       throw new Error(error?.message || "Failed to generate download URL")
    }

    // Redirect to the signed URL
    return NextResponse.redirect(data.signedUrl)
  } catch (error) {
    return apiError(error)
  }
}
