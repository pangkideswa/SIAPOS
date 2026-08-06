import "server-only"
import { type Jurusan } from "@/generated/prisma/client"
import { jurusanRepository } from "@/repositories/jurusan.repository"
import { assertUniqueField } from "@/lib/duplicate-check"
import type { Jurusan as JurusanType } from "@/features/jurusan/types/jurusan"
import type { PaginatedResponse } from "@/types"

export interface JurusanFilters {
  search?: string
  is_active?: boolean
  page?: number
  per_page?: number
}

export interface JurusanCreateInput {
  code: string
  name: string
  description?: string | null
  is_active?: boolean
}

function toJurusan(row: Jurusan): JurusanType {
  return {
    id: row.id,
    code: row.code,
    name: row.name,
    description: row.description,
    is_active: row.is_active,
    created_at: row.created_at.toISOString(),
    updated_at: row.updated_at.toISOString(),
  }
}

export const jurusanService = {
  async getAll(
    filters: JurusanFilters = {}
  ): Promise<PaginatedResponse<JurusanType>> {
    const per_page = filters.per_page ?? 10
    const page = filters.page ?? 1

    const where = {
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" as const } },
              { code: { contains: filters.search, mode: "insensitive" as const } },
              {
                description: {
                  contains: filters.search,
                  mode: "insensitive" as const,
                },
              },
            ],
          }
        : {}),
      ...(filters.is_active !== undefined
        ? { is_active: filters.is_active }
        : {}),
    }

    const [rows, total] = await Promise.all([
      jurusanRepository.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (page - 1) * per_page,
        take: per_page,
      }),
      jurusanRepository.count(where),
    ])

    return {
      data: rows.map(toJurusan),
      meta: {
        current_page: page,
        last_page: Math.max(1, Math.ceil(total / per_page)),
        per_page,
        total,
      },
    }
  },

  async getById(id: number): Promise<JurusanType | null> {
    const row = await jurusanRepository.findById(id)
    return row ? toJurusan(row) : null
  },

  async create(data: JurusanCreateInput): Promise<JurusanType> {
    await assertUniqueField(
      (value) => jurusanRepository.findFirst({ code: value }),
      data.code,
      "Kode jurusan"
    )
    const row = await jurusanRepository.create({
      code: data.code.trim().toUpperCase(),
      name: data.name,
      description: data.description ?? null,
      is_active: data.is_active ?? true,
    })
    return toJurusan(row)
  },

  async update(
    id: number,
    data: JurusanCreateInput
  ): Promise<JurusanType | null> {
    await assertUniqueField(
      (value) => jurusanRepository.findFirst({ code: value }),
      data.code,
      "Kode jurusan",
      id
    )
    const row = await jurusanRepository.update(id, {
      code: data.code.trim().toUpperCase(),
      name: data.name,
      description: data.description ?? null,
      is_active: data.is_active ?? true,
    })
    return row ? toJurusan(row) : null
  },

  async remove(id: number): Promise<boolean> {
    await jurusanRepository.delete(id)
    return true
  },
}
