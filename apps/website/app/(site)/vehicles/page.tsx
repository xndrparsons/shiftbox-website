import VehicleCard from "@/components/business/VehicleCard"
import { supabaseServer } from "@/lib/supabase/server"

export const revalidate = 60

export default async function VehiclesPage() {
  const supabase = await supabaseServer()
  if (!supabase) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Vehicles</h1>
        <p className="text-sm text-muted-foreground">
          Missing Supabase env vars. Add <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> to <code>apps/website/.env.local</code>.
        </p>
      </main>
    )
  }

  // Simple list (tweak params as needed)
  const { data, error } = await supabase.rpc("list_public_sales", {
    p_limit: 60,
    p_offset: 0,
    p_make: null,
    p_model: null,
    p_fuel: null,
    p_trans: null,
    p_min_price: null,
    p_max_price: null,
  })

  if (error) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Vehicles</h1>
        <pre className="text-sm text-red-600">{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  const rows = Array.isArray(data) ? data.filter(Boolean) : []

  return (
    <main className="container mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-semibold">Vehicles</h1>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">No vehicles found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rows.map((v: any) => (
            <li key={v?.id}>
              <VehicleCard v={v} />
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
