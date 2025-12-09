import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid";

const ANON_COOKIE = "anon_id"
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

export async function middleware(req: NextRequest) {
  const response = NextResponse.next()
  let anonId = req.cookies.get(ANON_COOKIE)?.value

  if (!anonId) {
    anonId = uuid()
    response.cookies.set(ANON_COOKIE, anonId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365 // 1 Year
    })
  }
  response.headers.set("x-anon-id", anonId)


  const url = req.nextUrl.pathname

  if (url.startsWith("/api")) {
    if (url.startsWith("/api/login")) return response

    const token = req.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return Response.json({ error: "Unauthorized" }, { status: 401 })
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
    "/"            // Anon coockie everywhere
  ]
}
