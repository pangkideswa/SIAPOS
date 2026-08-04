import "server-only"
import { ok } from "@/lib/api-utils"

export async function POST() {
  const response = ok(true, "Logout berhasil")
  response.cookies.delete("token")
  return response
}
