"use client"
import Link from "next/link"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-semibold">Shiftbox</Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/vehicles" className="hover:underline">Vehicles</Link>
          <Link href="/services" className="hover:underline">Services</Link>
          <Link href="/contact" className="hover:underline">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
