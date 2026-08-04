import "server-only"
import { prisma } from "@/lib/prisma"
import type { Prisma } from "@/generated/prisma/client"

export type SubmissionCreateData = Prisma.SubmissionUncheckedCreateInput
export type SubmissionUpdateData = Prisma.SubmissionUncheckedUpdateInput
export type SubmissionWhere = Prisma.SubmissionWhereInput

const SUBMISSION_INCLUDE = {
  student: { select: { nama_lengkap: true, kelas: true } },
} as const

export type SubmissionRow = Prisma.SubmissionGetPayload<{
  include: typeof SUBMISSION_INCLUDE
}>

export const submissionRepository = {
  async findAll(): Promise<SubmissionRow[]> {
    return prisma.submission.findMany({
      include: SUBMISSION_INCLUDE,
      orderBy: { created_at: "desc" },
    })
  },

  async findById(id: number): Promise<SubmissionRow | null> {
    return prisma.submission.findUnique({
      where: { id },
      include: SUBMISSION_INCLUDE,
    })
  },

  async findByAssignmentId(assignmentId: number): Promise<SubmissionRow[]> {
    return prisma.submission.findMany({
      where: { assignment_id: assignmentId },
      include: SUBMISSION_INCLUDE,
      orderBy: { created_at: "desc" },
    })
  },

  async findMany(where: SubmissionWhere): Promise<SubmissionRow[]> {
    return prisma.submission.findMany({
      where,
      include: SUBMISSION_INCLUDE,
      orderBy: { created_at: "desc" },
    })
  },

  async create(data: SubmissionCreateData): Promise<SubmissionRow> {
    return prisma.submission.create({
      data,
      include: SUBMISSION_INCLUDE,
    })
  },

  async update(
    id: number,
    data: SubmissionUpdateData
  ): Promise<SubmissionRow | null> {
    return prisma.submission.update({
      where: { id },
      data,
      include: SUBMISSION_INCLUDE,
    })
  },

  async delete(id: number): Promise<void> {
    await prisma.submission.delete({ where: { id } })
  },
}
