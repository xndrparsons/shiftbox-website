"use client"

import Link from "next/link"
import CarIcon from "@/components/branding/CarIcon"
import { usePathname } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import Logo from "@/components/branding/Logo"

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  const pathname = usePathname()
  const isActive = pathname === href
  return (
    <Link
      href={href}
      className={[
        "uppercase tracking-[0.08em] text-xs md:text-sm",
        "opacity-90 hover:opacity-100 transition",
        isActive ? "text-foreground" : "text-foreground/80",
      ].join(" ")}
    >
      {children}
    </Link>
  )
}

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur">
      <div className="container mx-auto h-14 px-3 md:px-4 flex items-center justify-between">
        {/* Left: mobile burger + logo */}
        <div className="flex items-center gap-2">
          {/* Mobile burger */}
          <div className="md:hidden -ml-1">
            <MobileMenu />
          </div>

          {/* Single Link around presentational Logo */}
          <Link href="/" aria-label="Shiftbox home" className="inline-flex items-center">
            <span className="relative inline-flex items-center md:static">
      {/* Mobile-only “speed lines” behind the car */}
      <CarIcon className="relative z-10 h-5 w-auto text-foreground/70 md:h-6 [filter:drop-shadow(0_0_4px_rgba(255,255,255,.08))]" />
    </span>
            <Logo className="text-lg md:text-xl leading-none" />
          </Link>
        </div>

        {/* Right: desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLink href="/vehicles">Vehicles</NavLink>
          <NavLink href="/services">Services</NavLink>

          {/* Contact as emphasized button */}
          <Button
            asChild
            className="uppercase tracking-[0.08em] text-xs md:text-sm bg-foreground text-background hover:bg-foreground/90"
          >
            <Link href="/contact">Contact</Link>
          </Button>
        </nav>
      </div>
    </header>
  )
}

function MobileMenu() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button
          aria-label="Open menu"
          className="relative h-8 w-8 grid place-items-center rounded-md border border-border/70 bg-background/60 backdrop-blur hover:bg-background/80"
        >
          {/* 3 lines behind the car = “speed lines” feel */}
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-60">
            <span className="h-px w-5 bg-foreground/60" />
            <span className="h-px w-5 bg-foreground/60" />
            <span className="h-px w-5 bg-foreground/60" />
          </span>
          
        </button>
      </SheetTrigger>
      <SheetContent
        side="left"
        className="w-80 border-l-0 border-border/60 bg-background/80 backdrop-blur-xl shadow-[0_0_0_1px_hsl(var(--border)/.6),0_10px_30px_rgba(0,0,0,.35)]"
      >
        <div className="mt-6 space-y-6">
          <Link href="/" className="inline-flex items-center" aria-label="Shiftbox home">
            <Logo className="text-xl leading-none" />
          </Link>

          <div className="grid gap-4 pt-4">
            <Link
              href="/vehicles"
              className="uppercase tracking-[0.1em] text-sm text-foreground/90 hover:text-foreground"
            >
              Vehicles
            </Link>
            <Link
              href="/services"
              className="uppercase tracking-[0.1em] text-sm text-foreground/90 hover:text-foreground"
            >
              Services
            </Link>
          </div>

          <div className="pt-2">
            <Button
              asChild
              className="w-full uppercase tracking-[0.1em] text-sm bg-foreground text-background hover:bg-foreground/90"
            >
              <Link href="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
