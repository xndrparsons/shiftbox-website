import "./globals.css"
import type { Metadata } from "next"
import { Sixtyfour, Bebas_Neue } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

const sixtyfour = Sixtyfour({ subsets: ["latin"], weight: "400", variable: "--font-sixtyfour", display: "swap" })
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" })

export const metadata: Metadata = {
  title: "Shiftbox",
  description: "Performance. Precision. Trust.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sixtyfour.variable} ${bebas.variable} ${GeistSans.variable} ${GeistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-dvh bg-background text-foreground font-body antialiased">
        {/* background glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 [background:radial-gradient(40%_30%_at_80%_10%,rgba(168,85,247,.08),transparent_60%),radial-gradient(40%_30%_at_20%_0%,rgba(56,189,248,.12),transparent_60%)]" />
        {children}
      </body>
    </html>
  )
}
