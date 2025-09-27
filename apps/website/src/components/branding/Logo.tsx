i"use client"

import Link from "next/link"
import * as React from "react"
import clsx from "clsx"

type LogoProps = {
  variant?: "miami" | "sunset" | "cyber" | "lava"
  className?: string
}

const gradientMap: Record<NonNullable<LogoProps["variant"]>, string> = {
  miami:  "bg-[linear-gradient(180deg,#00E5FF_0%,#7C4DFF_55%,#FF4D9D_100%)]",
  sunset: "bg-[linear-gradient(180deg,#FFC107_0%,#FF6D00_50%,#D500F9_100%)]",
  cyber:  "bg-[linear-gradient(180deg,#B2FFF6_0%,#00E5FF_55%,#00BFA5_100%)]",
  lava:   "bg-[linear-gradient(180deg,#FFF176_0%,#FF9100_50%,#FF3D00_100%)]",
}

export default function Logo({ variant = "miami", className }: LogoProps) {
  return (
    <Link href="/" aria-label="Shiftbox home" className={clsx("relative inline-flex items-center gap-2", className)}>
      {/* Mobile-only “speed lines” burger behind the car */}
      <span className="absolute -left-3 top-1/2 -translate-y-1/2 md:hidden pointer-events-none z-0">
        <span className="block w-5 h-0.5 bg-foreground/60 mb-0.5"></span>
        <span className="block w-4 h-0.5 bg-foreground/50 mb-0.5"></span>
        <span className="block w-3 h-0.5 bg-foreground/40"></span>
      </span>

      {/* Retro wedge car outline */}
      <svg
        className="relative z-10 h-6 w-auto text-foreground"
        viewBox="0 0 140 40"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        {/* simple wedge silhouette */}
        <path d="M6 28 L24 14 L75 10 L108 12 L132 22 L132 28 Z" />
        <path d="M35 27 A5 5 0 1 0 35 27.01" />
        <path d="M107 27 A5 5 0 1 0 107 27.01" />
        <path d="M47 16 L70 15" />
      </svg>

      {/* SHIFTBOX text with gradient */}
      <span className={clsx(
        "relative z-10 font-logo tracking-wide bg-clip-text text-transparent leading-none select-none",
        gradientMap[variant]
      )}>
        <span className="text-xl sm:text-2xl">SHIFTBOX</span>
      </span>
    </Link>
  )
}
