"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import ThemePicker from "./ThemePicker"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export default function Header() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  const linkCls = (href: string) =>
    [
      "opacity-90 hover:opacity-100 transition",
      "uppercase tracking-wide",
      pathname === href ? "font-semibold" : "font-medium",
    ].join(" ")

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Brand + Burger (burger tucked behind car) */}
        <div className="relative flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="Open menu"
                className="absolute -left-2 top-1/2 -translate-y-1/2 h-6 w-6 md:hidden"
              >
                <span className="absolute inset-x-0 top-0 h-0.5 bg-foreground/80"></span>
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-0.5 bg-foreground/80"></span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-foreground/80"></span>
              </button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="backdrop-blur-md bg-background/90 border-r border-border shadow-[0_0_0_1px_hsl(var(--border))] [box-shadow:0_0_40px_hsl(var(--border)/0.25)]"
            >
              <nav className="mt-10 grid gap-4 text-lg">
                <Link href="/" onClick={() => setOpen(false)} className={linkCls("/")}>HOME</Link>
                <Link href="/vehicles" onClick={() => setOpen(false)} className={linkCls("/vehicles")}>VEHICLES</Link>
                <Link href="/services" onClick={() => setOpen(false)} className={linkCls("/services")}>SERVICES</Link>
                <Link href="/contact" onClick={() => setOpen(false)} className={linkCls("/contact")}>CONTACT</Link>
              </nav>
              <div className="mt-8"></div>
            </SheetContent>
          </Sheet>

          {/* Car outline with “speed lines” implied by the burger lines */}
          <Link href="/" aria-label="Shiftbox home" className="relative inline-flex items-center pl-5">
            <CarWithSpeedLines />
            <span className="ml-2 logo-text font-logo tracking-wide text-xl md:text-2xl select-none">
              SHIFTBOX
            </span>
          </Link>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/vehicles" className={linkCls("/vehicles")}>VEHICLES</Link>
          <Link href="/services" className={linkCls("/services")}>SERVICES</Link>
          <Link href="/contact"  className={linkCls("/contact")}>CONTACT</Link>
          <div className="ml-2">
            <ThemePicker />
          </div>
        </nav>
      </div>
    </header>
  )
}

function CarWithSpeedLines() {
  return (
    <svg width="36" height="18" viewBox="0 0 36 18" aria-hidden="true" className="text-foreground/90">
      <path
        d="M2 12h7l3-4h9l3 3h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="11" cy="12" r="2" fill="currentColor" />
      <circle cx="26" cy="12" r="2" fill="currentColor" />
    </svg>
  )
}
