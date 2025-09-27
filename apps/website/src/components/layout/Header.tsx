"use client"

import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" aria-label="Shiftbox home" className="inline-flex items-center">
          <span className="logo-text font-logo tracking-wide text-xl bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">
            SHIFTBOX
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <Link href="/vehicles" className="opacity-90 hover:opacity-100 transition">Vehicles</Link>
          <Link href="/services" className="opacity-90 hover:opacity-100 transition">Services</Link>
          <Link href="/contact" className="opacity-90 hover:opacity-100 transition">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
