import "server-only"
import { NextRequest } from "next/server"
import { materialService } from "@/services/material.service"
import { ok, apiError, notFound, parseWithSchema } from "@/lib/api-utils"
import { materialSchema } from "@/lib/validations/material.schemas"
import {
  assertMaterialAccess,
  assertTeachingClassAccess,
  requireApiUser,
} from "@/auth/api-authorization"
import type { MateriFormData } from "@/features/materi/types/materi"
import { assertValidMaterialPath } from "@/lib/storage/path-validator"

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser()
    const { id } = await context.params
    await assertMaterialAccess(user, Number(id))
    const material = await materialService.getById(Number(id))
    if (!material) return notFound("Materi tidak ditemukan")
    return ok(material)
  } catch (error) {
    return apiError(error)
  }
}

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    const materialId = Number(id)
    
    await assertMaterialAccess(user, materialId)
    const body = parseWithSchema(materialSchema, await request.json()) as unknown as MateriFormData
    await assertTeachingClassAccess(user, body.kelas_mengajar_id)
    
    // --- PHASE 4: CLEANUP PROCESS ---
    const { deleteMaterialFileIfStorage } = await import("@/lib/storage/material-helper")
    const oldMaterial = await materialService.getById(materialId)
    
    // Validate new paths and handle deletions
    if (body.thumbnail_url && !body.thumbnail_url.startsWith('http') && body.thumbnail_url !== oldMaterial?.thumbnail_url) {
       if (!assertValidMaterialPath(body.thumbnail_url, materialId)) {
          return apiError(new Error("Invalid thumbnail storage path. Namespace mismatch."), 400)
       }
    }

    if (body.lampiran && Array.isArray(body.lampiran)) {
       for (const lamp of body.lampiran) {
          if (lamp.storage_path && !assertValidMaterialPath(lamp.storage_path, materialId)) {
             return apiError(new Error(`Invalid storage path for ${lamp.nama}. Namespace mismatch.`), 400)
          }
       }
    }

    try {
      const material = await materialService.update(
        materialId,
        body
      )
      
      // Post-DB Success Cleanup
      if (body.thumbnail_url !== oldMaterial?.thumbnail_url) {
         if (oldMaterial?.thumbnail_url) {
            await deleteMaterialFileIfStorage(oldMaterial.thumbnail_url)
         }
      }

      if (body.lampiran && Array.isArray(body.lampiran)) {
         if (oldMaterial?.lampiran && Array.isArray(oldMaterial.lampiran)) {
            const newIds = body.lampiran.map((l: { id: number }) => l.id)
            for (const oldLamp of oldMaterial.lampiran) {
               if (!newIds.includes(oldLamp.id)) {
                  const toDelete = oldLamp.storage_path || oldLamp.url
                  if (toDelete) await deleteMaterialFileIfStorage(toDelete)
               }
            }
         }
      }

      return ok(material, "Materi berhasil diperbarui")
    } catch (dbError) {
      // Orphan cleanup on DB failure
      if (body.thumbnail_url && !body.thumbnail_url.startsWith('http') && body.thumbnail_url !== oldMaterial?.thumbnail_url) {
         await deleteMaterialFileIfStorage(body.thumbnail_url)
      }
      
      if (body.lampiran && Array.isArray(body.lampiran)) {
         const oldPaths = oldMaterial?.lampiran?.map(l => l.storage_path || l.url) || []
         for (const lamp of body.lampiran) {
            if (lamp.storage_path && !oldPaths.includes(lamp.storage_path)) {
               await deleteMaterialFileIfStorage(lamp.storage_path)
            }
         }
      }
      throw dbError
    }
  } catch (error: unknown) {
    return apiError(error)
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await requireApiUser("super_admin", "admin", "guru")
    const { id } = await context.params
    const materialId = Number(id)
    
    await assertMaterialAccess(user, materialId)
    
    const oldMaterial = await materialService.getById(materialId)
    if (oldMaterial) {
       const { deleteMaterialFileIfStorage } = await import("@/lib/storage/material-helper")
       
       if (oldMaterial.thumbnail_url) {
          await deleteMaterialFileIfStorage(oldMaterial.thumbnail_url)
       }
       
       if (oldMaterial.lampiran && Array.isArray(oldMaterial.lampiran)) {
          for (const lamp of oldMaterial.lampiran) {
             const toDelete = lamp.storage_path || lamp.url
             if (toDelete) await deleteMaterialFileIfStorage(toDelete)
          }
       }
    }

    await materialService.remove(materialId)
    return ok(true, "Materi berhasil dihapus")
  } catch (error) {
    return apiError(error)
  }
}
