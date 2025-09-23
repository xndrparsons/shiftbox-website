import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

/**
 * Server-side Supabase client for RSC/route handlers.
 * Reads/writes auth cookies via Next's cookies() API.
 */
export async function supabaseServer() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !anon) {
    console.warn("⚠️ Supabase env vars missing: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY")
    return null as any
  }

  const cookieStore = await cookies()

  return createServerClient(url, anon, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: any) {
        try {
          // @ts-ignore
          cookieStore.set({ name, value, ...options })
        } catch { /* no-op in RSC */ }
      },
      remove(name: string, options: any) {
        try {
          // @ts-ignore
          cookieStore.set({ name, value: "", ...options, maxAge: 0 })
        } catch { /* no-op in RSC */ }
      },
    },
  })
}
