// apps/website/src/components/layout/Header.tsx
import Link from "next/link"
import { cookies } from "next/headers"
import { createServerClient } from "@supabase/ssr"

async function hasSession(): Promise<boolean> {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { get: (n: string) => cookieStore.get(n)?.value } }
  )
  const { data: { user } } = await supabase.auth.getUser()
  return !!user
}

export default async function Header() {
  const isAdmin = await hasSession()

  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, oklch(0.6801 0.1583 276.9349), oklch(0.7845 0.1325 181.9120))",
            }}
          >
            Shiftbox
          </span>
        </Link>

        <nav className="hidden gap-6 md:flex">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">Home</Link>
          <Link href="/vehicles" className="text-sm text-muted-foreground hover:text-foreground">Vehicles</Link>
          <Link href="/services" className="text-sm text-muted-foreground hover:text-foreground">Services</Link>
          <Link href="/portfolio" className="text-sm text-muted-foreground hover:text-foreground">Portfolio</Link>
          <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">Blog</Link>
          <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <Link href="/(admin)" className="hidden sm:inline text-sm underline-offset-4 hover:underline">
                Website Admin
              </Link>
              <Link
                href={process.env.NEXT_PUBLIC_APP_URL || "https://app.shiftbox.uk"}
                className="text-sm rounded-md border px-2.5 py-1.5 hover:bg-accent"
              >
                App Dashboard
              </Link>
            </>
          )}
          <Link href="/auth/login" className="text-sm text-muted-foreground hover:text-foreground">
            {isAdmin ? "Account" : "Login"}
          </Link>
        </div>
      </div>
    </header>
  )
}
