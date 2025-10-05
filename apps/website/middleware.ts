import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

const ADMIN_PREFIX = "/admin"

export async function middleware(req: NextRequest) {
  const { pathname, origin } = req.nextUrl
  if (!pathname.startsWith(ADMIN_PREFIX)) return NextResponse.next()

  const res = NextResponse.next()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get: (name) => req.cookies.get(name)?.value,
        set: (name, value, options) => res.cookies.set({ name, value, ...options }),
        remove: (name, options) => res.cookies.set({ name, value: "", ...options, maxAge: 0 }),
      }
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    const url = new URL("/auth/login", origin)
    url.searchParams.set("redirect", pathname)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: ["/admin/:path*"],
}
