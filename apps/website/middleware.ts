import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const isProd = process.env.NODE_ENV === "production"
  const res = NextResponse.next()

  if (!isProd) {
    // Tell crawlers not to index *any* non-prod pages
    res.headers.set("X-Robots-Tag", "noindex, nofollow")
  }
  return res
}

export const config = {
  matcher: ["/:path*"], // apply everywhere
}
