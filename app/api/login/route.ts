import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";
import { base64url, SignJWT } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)
const API_ADMIN_BCRYPT_HASH_BASE64 = process.env.API_ADMIN_BCRYPT_HASH!
const API_ADMIN_BCRYPT_HASH = new TextDecoder().decode(base64url.decode(API_ADMIN_BCRYPT_HASH_BASE64))

export async function POST(req: NextRequest) {
  const { password } = await req.json()

  if (!password || typeof password !== "string") {
    return Response.json({ error: "Invalid password" }, { status: 400 })
  }

  if (!await bcrypt.compare(password, API_ADMIN_BCRYPT_HASH)) {
    return Response.json({ error: "Invalid credentails" }, { status: 401 })
  }

  const token = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  return Response.json({ token })
}
