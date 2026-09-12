import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const ANON_COOKIE = "anon_id"

function getJwtSecret(): Uint8Array | null {
  const value = process.env.JWT_SECRET
  if (!value) return null
  return new TextEncoder().encode(value)
}

function getBearerToken(req: NextRequest): string | null {
  const header = req.headers.get("authorization")
  if (!header) return null
  const match = /^Bearer\s+(.+)$/i.exec(header.trim())
  return match ? match[1].trim() || null : null
}

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()
  let anonId = req.cookies.get(ANON_COOKIE)?.value

  if (!anonId) {
    anonId = uuid()
    response.cookies.set(ANON_COOKIE, anonId, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 365 // 1 Year
    })
  }
  response.headers.set("x-anon-id", anonId)

  const url = req.nextUrl.pathname

  if (url.startsWith("/api")) {
    if (url.startsWith("/api/login")) return response

    // Public reads: the frontend poll widget and other clients fetch polls
    // without a token. Only mutations require authentication.
    if (req.method === "GET" && url.startsWith("/api/poll")) return response

    const token = getBearerToken(req)

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const JWT_SECRET = getJwtSecret()
    if (!JWT_SECRET) {
      return Response.json({ error: "API JWT secret is not configured" }, { status: 500 })
    }

    try {
      await jwtVerify(token, JWT_SECRET)
    } catch {
      return Response.json({ error: "Invalid token" }, { status: 401 })
    }

    return response
  }
  return response
}

export const config = {
  matcher: [
    "/api/:path*", // API Auth
    "/((?!api|_next/static|_next/image|favicon.ico).*)" // Anon cookie everywhere
  ]
}
