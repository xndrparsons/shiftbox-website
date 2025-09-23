import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url)
  const isProd = process.env.NODE_ENV === "production"

  const res = NextResponse.next()
  if (!isProd) {
    res.headers.set("X-Robots-Tag", "noindex, nofollow")
  }

  if (pathname.startsWith("/(admin)")) {
    const hasSession =
      req.cookies.get("sb-access-token")?.value ||
      req.cookies.get("supabase-auth-token")?.value

    if (!hasSession) {
      const login = new URL("/auth/login", req.url)
      login.searchParams.set("next", pathname)
      return NextResponse.redirect(login)
    }
  }

  return res
}

export const config = { matcher: ["/:path*"] }
