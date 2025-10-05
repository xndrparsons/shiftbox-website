"use client"

import { useEffect, useState } from "react"

const THEMES = [
  { id: "miami", label: "Miami" },
  { id: "retro-cyan", label: "Retro Cyan" },
  { id: "retro-magenta", label: "Retro Magenta" },
  { id: "neon-sunset", label: "Neon Sunset" },
  { id: "electric-purple", label: "Electric Purple" },
] as const

type ThemeId = typeof THEMES[number]["id"]

export default function ThemePicker() {
  const [theme, setTheme] = useState<ThemeId>("miami")

  // Initialise from current <html data-theme="..."> if present
  useEffect(() => {
    const html = document.documentElement
    const current = html.getAttribute("data-theme") as ThemeId | null
    if (current && THEMES.some(t => t.id === current)) {
      setTheme(current)
    } else {
      html.setAttribute("data-theme", "miami")
    }
  }, [])

  // Apply to <html> when changed
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme)
  }, [theme])

  return (
    <div className="flex items-center gap-2">
      {THEMES.map(t => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTheme(t.id)}
          aria-pressed={theme === t.id}
          className={[
            "rounded-md px-2.5 py-1 text-xs uppercase tracking-wide",
            "border border-border/70 bg-background/70 backdrop-blur",
            theme === t.id ? "opacity-100" : "opacity-70 hover:opacity-100"
          ].join(" ")}
          title={t.label}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}
