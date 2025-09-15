import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

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
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Suspense fallback={null}>{children}</Suspense>
        <Analytics />
      </body>
    </html>
  )
}
