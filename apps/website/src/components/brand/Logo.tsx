"use client"
import Link from "next/link"
import { cn } from "@/lib/utils"

type Props = { asLink?: boolean; size?: "sm" | "md" | "lg" | "xl"; className?: string }
const baseClasses = "bg-gradient-to-b from-[oklch(85%_0.15_235)] via-[oklch(72%_0.20_270)] to-[oklch(64%_0.22_300)] bg-clip-text text-transparent"
const sizes = { sm: "text-2xl", md: "text-3xl", lg: "text-4xl", xl: "text-5xl" }

export default function Logo({ asLink = true, size = "md", className }: Props) {
  const El: any = asLink ? Link : "div"
  return (
    <El href={asLink ? "/" : undefined} className={cn("inline-block font-logo tracking-tight leading-none select-none", sizes[size], baseClasses, className)} aria-label="Shiftbox">
      SHIFTBOX
    </El>
  )
}
