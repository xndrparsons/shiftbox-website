"use client"
import * as React from "react"

// Swap this for next-themes if you plan to support theme switching.
export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
