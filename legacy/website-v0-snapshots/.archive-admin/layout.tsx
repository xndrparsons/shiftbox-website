import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ScrollToTop } from "@/components/ScrollToTop"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

export const metadata: Metadata = {
  title: "Shiftbox - Quality Cars & Expert Service in Kendal, Cumbria",
  description:
    "Professional automotive services in Kendal, Cumbria. Quality used cars, expert servicing, and premium detailing. Trusted by customers across the Lake District.",
  keywords: "used cars Kendal, car servicing Cumbria, car detailing, automotive repair, Lake District cars",
  authors: [{ name: "Shiftbox" }],
  creator: "Shiftbox",
  publisher: "Shiftbox",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_GB",
    url: "https://shiftbox.co.uk",
    title: "Shiftbox - Quality Cars & Expert Service in Kendal, Cumbria",
    description:
      "Professional automotive services in Kendal, Cumbria. Quality used cars, expert servicing, and premium detailing.",
    siteName: "Shiftbox",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shiftbox - Quality Cars & Expert Service in Kendal, Cumbria",
    description:
      "Professional automotive services in Kendal, Cumbria. Quality used cars, expert servicing, and premium detailing.",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange={false}>
          <ScrollToTop />
          <Header />
          <Suspense fallback={null}>{children}</Suspense>
          <Footer />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  )
}
