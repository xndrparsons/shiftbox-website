"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background: image (optional) + radial + vignette */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          backgroundImage: `linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--background)) 20%, transparent 60%),
                            radial-gradient(80% 100% at 10% 0%, rgba(124,77,255,.15) 0%, transparent 60%),
                            radial-gradient(70% 90% at 90% 10%, rgba(0,229,255,.12) 0%, transparent 60%)`,
          backgroundColor: "hsl(var(--background))",
        }}
      />
      {/* Optional hero image – place /hero.jpg to enable */}
      <div
        className="absolute inset-0 -z-20 bg-center bg-cover opacity-[.18]"
        style={{ backgroundImage: "url('/hero.jpg')" }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-4 py-16 md:py-24 lg:py-28">
        <div className="max-w-3xl">
          <h1 className="font-heading tracking-tight leading-[0.9] text-5xl sm:text-6xl md:text-7xl text-foreground">
            <span className="block">Quality Cars</span>
            <span className="block">
              &nbsp;<span className="bg-clip-text text-transparent" style={{ backgroundImage: "var(--logo-gradient)" }}>Expert</span>
              &nbsp;Service
            </span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-foreground/70 max-w-2xl">
            Independent garage near Kendal. Straightforward cars, transparent work, pro detailing.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="px-5">
              <Link href="/vehicles">Browse Vehicles →</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="px-5">
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
