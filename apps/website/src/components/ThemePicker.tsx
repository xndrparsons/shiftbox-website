"use client"

import * as React from "react"

type Theme = "midnight" | "neon" | "miami" | "sunset" | "cyber" | "lava"

const THEMES: Theme[] = ["midnight", "neon", "miami", "sunset", "cyber", "lava"]

// Quick visual swatches (pure CSS) to preview each gradient.
const SWATCH: Record<Theme, React.CSSProperties> = {
  midnight: { background: "linear-gradient(180deg,#FFFFFF 0%,#FFFFFFAA 100%)" },
  neon:     { background: "linear-gradient(180deg,#7DF9FF 0%,#B026FF 100%)" },
  miami:    { background: "linear-gradient(180deg,#00E5FF 0%,#7C4DFF 55%,#FF4D9D 100%)" },
  sunset:   { background: "linear-gradient(180deg,#FFC107 0%,#FF6D00 50%,#D500F9 100%)" },
  cyber:    { background: "linear-gradient(180deg,#B2FFF6 0%,#00E5FF 55%,#00BFA5 100%)" },
  lava:     { background: "linear-gradient(180deg,#FFF176 0%,#FF9100 50%,#FF3D00 100%)" },
}

export default function ThemePicker() {
  const [theme, setTheme] = React.useState<Theme>("miami")

  // Load saved theme on mount
  React.useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("shiftbox-theme")) as Theme | null
    if (saved && THEMES.includes(saved)) {
      setTheme(saved)
      document.documentElement.setAttribute("data-theme", saved)
    } else {
      // ensure we at least set the current state to DOM
      document.documentElement.setAttribute("data-theme", theme)
    }
  }, [])

  const apply = (t: Theme) => {
    setTheme(t)
    document.documentElement.setAttribute("data-theme", t)
    try { localStorage.setItem("shiftbox-theme", t) } catch {}
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs opacity-70">Theme</span>
      <div className="flex items-center gap-1">
        {THEMES.map((t) => (
          <button
            key={t}
            type="button"
            aria-label={`Switch theme to ${t}`}
            onClick={() => apply(t)}
            className={`h-6 w-6 rounded-md border border-border outline-none ring-offset-0 transition
              ${t === theme ? "ring-2 ring-white/60" : "hover:ring-2 hover:ring-white/30"}`}
            style={SWATCH[t]}
          />
        ))}
      </div>
    </div>
  )
}
