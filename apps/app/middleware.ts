import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = new URL(req.url)
  const isApp = pathname.startsWith("/(app)")
  if (isApp) {
    const token = req.cookies.get("sb-access-token")?.value
    if (!token) {
      const login = new URL("/(auth)/login", req.url)
      login.searchParams.set("next", pathname)
      return NextResponse.redirect(login)
    }
  }
  return NextResponse.next()
}
export const config = { matcher: ["/(app)(.*)","/portal/:path*"] }
