"use client"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span
            className="font-logo tracking-[0.08em] text-2xl md:text-3xl bg-gradient-to-b
                       from-[hsl(255,85%,85%)] via-[hsl(265,85%,75%)] to-[hsl(275,85%,65%)]
                       bg-clip-text text-transparent select-none"
          >
            SHIFTBOX
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/vehicles" className="hover:underline">Vehicles</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
