"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden dark:text-shadow-md/100">
      {/* Brighter background image (no dark overlay) */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/hero.jpg')] bg-cover bg-center opacity-80" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-24 md:py-32 lg:py-40 text-center">
        {/* Revert to simpler headline (no custom tracking/leading), keep gradient on EXPERT */}
        <h1 className="font-heading text-white text-4xl md:text-5xl lg:text-6xl">
          QUALITY CARS{"  "}
          <span className="whitespace-nowrap text-white/50">&amp; </span>
          <span className="block md:inline text-transparent bg-clip-text dark:text-shadow-none
                           bg-[linear-gradient(180deg,#00E5FF_0%,#7C4DFF_55%,#FF4D9D_100%)]">
            EXPERT
          </span>{"  "}
          <span>SERVICE</span>
        </h1>

        <p className="mt-4 max-w-4xl mx-auto text-md md:text-lg text-white/70">
          Meticulously selected cars, precision servicing, and honest guidance.
        </p>

        <p className="mt-2 max-w-4xl mx-auto text-lg md:text-xl text-white/85">
          Built for drivers who care.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <Link href="/vehicles" className="group">
            <Button
              className="h-12 px-6 rounded-xl bg-white/10 hover:text-purple-400 hover:bg-white/15 text-white
                         border border-white/10 backdrop-blur transition"
            >
              BROWSE VEHICLES
              <ChevronRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>

          <Link href="/contact">
            <Button
              className="h-12 px-6 rounded-xl bg-white/10 hover:text-purple-400 hover:bg-white/15 text-white/90
                         border border-white/10 backdrop-blur"
              variant={undefined as any}
            >
              CONTACT US
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
