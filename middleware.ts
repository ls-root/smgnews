import { NextRequest, NextResponse } from "next/server";
import { v4 as uuid } from "uuid"

const ANON_COOKIE = "anon_id"

export function middleware(request: NextRequest) {
  const response = NextResponse.next()
  let anonId = request.cookies.get(ANON_COOKIE)?.value

  if (!anonId) {
    anonId = uuid()
    response.cookies.set(ANON_COOKIE, anonId, {
      httpOnly: true,
      sameSite: "lax",
      secure: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 365 // 1 year
    })
  }

  response.headers.set("x-anon-id", anonId)

  return response
}
