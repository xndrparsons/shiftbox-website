import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import ThemeProvider from "@/components/providers/theme-provider"

export const metadata: Metadata = {
  title: "Shiftbox",
  description: "Performance. Precision. Trust.",
}

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Header />
      <main className="container mx-auto px-4 py-8 md:py-10">{children}</main>
      <Footer />
    </ThemeProvider>
  )
}
