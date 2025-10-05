import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  const DISABLE_MIDDLEWARE = process.env.DISABLE_MIDDLEWARE === "true"

  if (DISABLE_MIDDLEWARE) {
    console.log("[v0] Middleware - DISABLED for development")
    return NextResponse.next({ request })
  }

  console.log(
    "[v0] Middleware - NEXT_PUBLIC_SUPABASE_URL:",
    process.env.NEXT_PUBLIC_SUPABASE_URL ? "present" : "missing",
  )
  console.log(
    "[v0] Middleware - NEXT_PUBLIC_SUPABASE_ANON_KEY:",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "present" : "missing",
  )

  const isDevelopment = process.env.NODE_ENV === "development"
  const hasDebugBypass = request.cookies.get("admin_debug_bypass")?.value === "true"

  if (isDevelopment && hasDebugBypass && request.nextUrl.pathname.startsWith("/admin")) {
    console.log("[v0] Middleware - Using admin debug bypass")
    return NextResponse.next({ request })
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.log("[v0] Middleware - Missing Supabase environment variables")
    return NextResponse.next({ request })
  }

  let supabaseResponse = NextResponse.next({
    request,
  })

  // With Fluid compute, don't put this client in a global environment
  // variable. Always create a new one on each request.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) => supabaseResponse.cookies.set(name, value, options))
        },
      },
    },
  )

  // Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // IMPORTANT: If you remove getUser() and you use server-side rendering
  // with the Supabase client, your users may be randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Define public routes that don't require authentication
  const publicRoutes = ["/", "/auth/login", "/admin/login", "/auth/signout"]
  const isPublicRoute = publicRoutes.some(
    (route) => request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route),
  )

  // Only redirect to login if user is not authenticated AND trying to access a protected route
  if (!user && !isPublicRoute) {
    const url = request.nextUrl.clone()
    // Redirect admin routes to admin login, others to general auth login
    if (request.nextUrl.pathname.startsWith("/admin")) {
      url.pathname = "/admin/login"
    } else {
      url.pathname = "/auth/login"
    }
    return NextResponse.redirect(url)
  }

  // IMPORTANT: You *must* return the supabaseResponse object as it is.
  // If you're creating a new response object with NextResponse.next() make sure to:
  // 1. Pass the request in it, like so:
  //    const myNewResponse = NextResponse.next({ request })
  // 2. Copy over the cookies, like so:
  //    myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
  // 3. Change the myNewResponse object to fit your needs, but avoid changing
  //    the cookies!
  // 4. Finally:
  //    return myNewResponse
  // If this is not done, you may be causing the browser and server to go out
  // of sync and terminate the user's session prematurely!

  return supabaseResponse
}
