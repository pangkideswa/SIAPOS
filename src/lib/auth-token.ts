import "server-only"
import crypto from "node:crypto"

const SECRET = process.env.NEXTAUTH_SECRET ?? "dev-secret-change-me-in-production"
const TOKEN_TTL = 60 * 60 * 24 * 7

interface TokenPayload {
  sub: number
  role: string
  exp: number
}

function b64url(data: string | Buffer): string {
  return Buffer.from(data).toString("base64url")
}

export function signToken(payload: Omit<TokenPayload, "exp">): string {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_TTL
  const body = b64url(JSON.stringify({ ...payload, exp }))
  const sig = b64url(crypto.createHmac("sha256", SECRET).update(body).digest())
  return `${body}.${sig}`
}

export function verifyToken(token: string): TokenPayload | null {
  const [body, sig] = token.split(".")
  if (!body || !sig) return null
  const expected = b64url(
    crypto.createHmac("sha256", SECRET).update(body).digest()
  )
  if (sig !== expected) return null
  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8")
    ) as TokenPayload
    if (payload.exp < Math.floor(Date.now() / 1000)) return null
    return payload
  } catch {
    return null
  }
}
