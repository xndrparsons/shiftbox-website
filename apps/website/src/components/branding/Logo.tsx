"use client"

import clsx from "clsx"

type LogoProps = {
  className?: string
}

/**
 * Presentational logo unit: car glyph + gradient "SHIFTBOX" text.
 * NOTE: No <Link> here. Parent decides interactivity.
 */
export default function Logo({ className }: LogoProps) {
  return (
    <span className={clsx("relative inline-flex items-center gap-2", className)}>
      {/* Retro car glyph (swap to SVG later if you like) */}
      <span aria-hidden className="text-foreground/70 text-lg leading-none">⸺◁</span>
      {/* Gradient text pulled from CSS var --logo-gradient */}
      <span className="logo-text font-logo tracking-wide bg-clip-text text-transparent">
        SHIFTBOX
      </span>
    </span>
  )
}
