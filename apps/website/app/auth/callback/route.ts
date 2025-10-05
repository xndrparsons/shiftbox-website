import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function GET(req: Request) {
  const url = new URL(req.url)
  const code = url.searchParams.get("code")
  const redirect = url.searchParams.get("redirect") || "/admin"

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) { return cookies().get(name)?.value },
          set(name: string, value: string, options: any) { cookies().set(name, value, options) },
          remove(name: string, options: any) { cookies().set(name, "", { ...options, maxAge: 0 }) },
        }
      }
    )
    // Exchange the one-time code for a session cookie
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL(redirect, url.origin))
}
