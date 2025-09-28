import Hero from "@/components/sections/Hero"
import FeaturedVehicles from "@/components/sections/FeaturedVehicles"
import ServicesStrip from "@/components/sections/ServicesStrip"
import WhyShiftbox from "@/components/sections/WhyShiftbox"
import { supabaseServer } from "@/lib/supabase/server"

export const revalidate = 60

type Vehicle = {
  id: string
  make: string
  model: string
  year: number | null
  price: number | string | null
  mileage: number | null
  fuel_type?: string | null
}

export default async function Home() {
  // Default to empty; we’ll attempt to fetch below
  let featured: Vehicle[] = []

  // Try server client (helper returns null if env missing in dev)
  const supabase = await supabaseServer()
  if (supabase) {
    const { data, error } = await supabase.rpc("list_public_sales", {
      p_make: null,
      p_model: null,
      p_fuel: null,
      p_trans: null,
      p_min_price: null,
      p_max_price: null,
      p_limit: 6,
      p_offset: 0,
    })

    if (!error && Array.isArray(data)) {
      featured = data.map((v: any) => ({
        id: v.id,
        make: v.make,
        model: v.model,
        year: v.year ?? null,
        price: v.price ?? null,
        mileage: v.mileage ?? null,
        fuel_type: v.fuel_type ?? null,
      }))
    }
    // If there’s an error, we silently show an empty Featured section
  }

  return (
    <>
      <Hero />
      <FeaturedVehicles items={featured} />
      <ServicesStrip />
      <WhyShiftbox />
    </>
  )
}
