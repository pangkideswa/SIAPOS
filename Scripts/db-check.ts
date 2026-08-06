import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/siapos",
})
const prisma = new PrismaClient({ adapter })

async function main() {
  const [u, t, s, c, km, ta, m, a] = await Promise.all([
    prisma.user.count(),
    prisma.teacher.count(),
    prisma.student.count(),
    prisma.classroom.count(),
    prisma.teachingClass.count(),
    prisma.tahunAkademik.count(),
    prisma.material.count(),
    prisma.assignment.count(),
  ])
  console.log(
    JSON.stringify({
      users: u,
      teachers: t,
      students: s,
      classrooms: c,
      teachingClasses: km,
      tahunAkademik: ta,
      materials: m,
      assignments: a,
    })
  )
  const teachers = await prisma.teacher.findMany({
    include: {
      user: { select: { id: true, username: true, role: true, status: true } },
    },
  })
  console.log(
    "teacherUserLinks:",
    teachers.map((x) => ({
      name: x.nama_lengkap,
      user_id: x.user_id,
      username: x.user?.username ?? null,
      status: x.user?.status ?? null,
    }))
  )
  const students = await prisma.student.findMany({
    include: {
      user: { select: { id: true, username: true, role: true, status: true } },
    },
  })
  console.log(
    "studentUserLinks:",
    students.map((x) => ({
      name: x.nama_lengkap,
      user_id: x.user_id,
      nisn: x.nisn,
      username: x.user?.username ?? null,
      status: x.user?.status ?? null,
    }))
  )
}

main().then(() => process.exit(0))
