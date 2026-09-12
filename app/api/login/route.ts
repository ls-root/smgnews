import bcrypt from "bcryptjs";
import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest } from "next/server";
import { base64url, SignJWT } from "jose"

function plainPasswordMatches(input: string, expected: string) {
  const a = createHash("sha256").update(input).digest()
  const b = createHash("sha256").update(expected).digest()
  return timingSafeEqual(a, b)
}

export async function POST(req: NextRequest) {
  const jwtSecretValue = process.env.JWT_SECRET
  if (!jwtSecretValue) {
    return Response.json({ error: "API JWT secret is not configured" }, { status: 500 })
  }
  const JWT_SECRET = new TextEncoder().encode(jwtSecretValue)

  let password: unknown
  try {
    const body = await req.json()
    password = body?.password
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 })
  }

  if (!password || typeof password !== "string") {
    return Response.json({ error: "Invalid password" }, { status: 400 })
  }

  const apiAdminPassword = process.env.API_ADMIN_PASSWORD
  const apiAdminBcryptHash = process.env.API_ADMIN_BCRYPT_HASH

  if (!apiAdminPassword && !apiAdminBcryptHash) {
    return Response.json({ error: "API admin password is not configured" }, { status: 500 })
  }

  // API_ADMIN_PASSWORD is the single source of truth (also used by the
  // Poll Manager WordPress plugin). API_ADMIN_BCRYPT_HASH is legacy support.
  let valid = false
  if (apiAdminPassword) {
    valid = plainPasswordMatches(password, apiAdminPassword)
  } else {
    let bcryptHash: string
    try {
      bcryptHash = new TextDecoder().decode(base64url.decode(apiAdminBcryptHash!))
    } catch {
      return Response.json({ error: "API admin password is not configured correctly" }, { status: 500 })
    }
    valid = await bcrypt.compare(password, bcryptHash)
  }

  if (!valid) {
    return Response.json({ error: "Invalid credentials" }, { status: 401 })
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  return Response.json({ token })
}
