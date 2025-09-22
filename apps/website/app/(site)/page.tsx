import VehicleFilters from "@/components/business/VehicleFilters"
import { supabaseServer } from "@shiftbox/auth/supabase.server"
import Link from "next/link"

// Revalidate listings periodically
export const revalidate = 60

// Map search params to RPC params (shape your RPC expects)
function parseFilters(sp: Record<string, string | string[] | undefined>) {
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) ?? null
  const make = get("make")
  const model = get("model")
  const fuel = get("fuel")
  const trans = get("trans")
  const minPrice = get("minPrice") ? Number(get("minPrice")) : null
  const maxPrice = get("maxPrice") ? Number(get("maxPrice")) : null
  const page = get("page") ? Math.max(1, Number(get("page"))) : 1
  const pageSize = 12
  const offset = (page - 1) * pageSize

  return { make, model, fuel, trans, minPrice, maxPrice, limit: pageSize, offset }
}

export default async function VehiclesPage({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
  const supabase = supabaseServer()
  const { make, model, fuel, trans, minPrice, maxPrice, limit, offset } = parseFilters(searchParams)

  // Call your RPC. Adjust parameter names to match your SQL function.
  const { data, error } = await supabase.rpc("list_public_sales", {
    p_limit: limit,
    p_offset: offset,
    p_make: make,
    p_model: model,
    p_fuel: fuel,
    p_trans: trans,
    p_min_price: minPrice,
    p_max_price: maxPrice,
  })

  if (error) throw error
  const vehicles = data ?? []

  // Optionally fetch available makes for the filter Select
  const { data: makeRows } = await supabase.from("vehicles").select("make").eq("published", true).not("make", "is", null).order("make", { ascending: true })
  const makes = Array.from(new Set((makeRows ?? []).map((r) => r.make))).filter(Boolean) as string[]

  return (
    <main className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-3xl font-semibold">Vehicles</h1>

      <VehicleFilters makes={makes} minPrice={0} maxPrice={50000} />

      <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {vehicles.map((v: any) => (
          <article key={v.id} className="rounded-lg border overflow-hidden">
            <Link href={`/vehicles/${v.slug}`}>
              {/* Replace with your VehicleCard when ready */}
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-4">
                <div className="font-medium">{v.make} {v.model}</div>
                {"price_gbp" in v && typeof v.price_gbp === "number" && (
                  <div className="text-primary font-semibold">£{v.price_gbp.toLocaleString()}</div>
                )}
                {v.registration && <div className="text-sm text-muted-foreground">{v.registration}</div>}
              </div>
            </Link>
          </article>
        ))}
      </section>

      {/* TODO: pagination controls (Next/Prev) once count is available */}
    </main>
  )
}