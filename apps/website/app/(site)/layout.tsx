import "./globals.css"
import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ThemeProvider from "@/components/providers/theme-provider"
import { Sixtyfour, Bebas_Neue } from "next/font/google"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"

export const metadata: Metadata = {
  title: "Shiftbox",
  description: "Performance. Precision. Trust.",
}

const sixtyfour = Sixtyfour({ subsets: ["latin"], weight: "400", variable: "--font-sixtyfour", display: "swap" })
const bebas = Bebas_Neue({ subsets: ["latin"], weight: "400", variable: "--font-bebas", display: "swap" })

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${sixtyfour.variable} ${bebas.variable} ${GeistSans.variable} ${GeistMono.variable} dark`}
      suppressHydrationWarning
      style={{ colorScheme: "dark" }}
    >
      <body className="min-h-dvh bg-background text-foreground font-body antialiased">
        {/* background glow */}
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 [background:radial-gradient(60%_40%_at_80%_10%,rgba(120,119,198,.15),transparent_70%),radial-gradient(40%_30%_at_20%_0%,rgba(56,189,248,.12),transparent_60%)]" />
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <Header />
          <main className="container mx-auto px-4 py-8 md:py-10">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
