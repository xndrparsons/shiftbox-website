// apps/website/app/(site)/page.tsx
import Hero from "@/components/sections/Hero"
import WhyShiftbox from "@/components/sections/WhyShiftbox"
import ServicesTeaser from "@/components/sections/ServicesTeaser"
import FeaturedVehicles from "@/components/sections/FeaturedVehicles"
import TrustStrip from "@/components/sections/TrustStrip"
import FooterCta from "@/components/sections/FooterCta"

import { supabaseServer } from "@/lib/supabase/server"

// Revalidate periodically (adjust as needed)
export const revalidate = 60

// Minimal shape we render in FeaturedVehicles; align with your RPC
type Featured = {
  id: string
  make: string | null
  model: string | null
  year: number | null
  price: number | string | null
  mileage: number | null
  fuel_type: string | null
  dvla_colour?: string | null
}

export default async function Home() {
  // Get Supabase (server) and guard for missing envs in dev
  const supabase = await supabaseServer()
  let featured: Featured[] = []

  if (supabase) {
    // A tiny “featured” slice from your public sales RPC
    // Tune the params as you like (e.g., cheapest first, newest first, etc.)
    const { data } = await supabase.rpc("list_public_sales", {
      p_make: null,
      p_model: null,
      p_fuel: null,
      p_trans: null,
      p_min_price: null,
      p_max_price: null,
      p_limit: 6,
      p_offset: 0,
    })
    featured = (data ?? []) as Featured[]
  }

  return (
    <main className="container mx-auto px-4 py-8 md:py-10 space-y-10">
      <Hero />
      <WhyShiftbox />
      <ServicesTeaser />

      {/* Pass the featured vehicles (empty array is fine; section can handle “no data” state) */}
      <FeaturedVehicles vehicles={featured} />

      <TrustStrip />
      <FooterCta />
    </main>
  )
}