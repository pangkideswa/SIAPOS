import "dotenv/config"
import { PrismaClient } from "../src/generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"
import { compare } from "bcryptjs"

const adapter = new PrismaPg({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/siapos",
})
const prisma = new PrismaClient({ adapter })

async function check(label: string, identifier: string, password: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: identifier.toLowerCase() },
        { username: identifier },
        { nip: identifier },
        { nisn: identifier },
        { name: { equals: identifier, mode: "insensitive" } },
      ],
    },
  })
  if (!user) {
    console.log(`${label}: NOT FOUND (${identifier})`)
    return
  }
  const valid = user.password ? await compare(password, user.password) : false
  console.log(
    `${label}: ${valid ? "OK" : "WRONG PASSWORD"} -> user=${user.username} role=${user.role} name=${user.name}`
  )
}

async function main() {
  await check("admin-username", "admin", "admin123")
  await check("guru-username", "guru", "Guru123!")
  await check("guru-nip", "199005152015022001", "Guru123!")
  await check("guru-nama", "Asep Nugraha", "Guru123!")
  await check("siswa-username", "siswa1", "Siswa123!")
  await check("siswa-nisn", "0081234567", "Siswa123!")
  await check("siswa-nama", "Rizki Pratama", "Siswa123!")
  process.exit(0)
}

main()
