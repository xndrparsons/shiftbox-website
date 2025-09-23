import Link from "next/link"
import { supabaseServer } from "@/lib/supabase/server"

// Revalidate periodically (adjust as needed)
export const revalidate = 60

type Search = Record<string, string | string[] | undefined>

function parseFilters(sp: Search) {
  const get = (k: string) => (Array.isArray(sp[k]) ? sp[k]?.[0] : sp[k]) ?? null
  const make = get("make")
  const model = get("model")
  const fuel = get("fuel")
  const trans = get("trans")
  const min = get("min")
  const max = get("max")
  const page = Number(get("page") ?? 1)
  const limit = 12
  const offset = (page - 1) * limit
  const p_min_price = min ? Number(min) : null
  const p_max_price = max ? Number(max) : null
  return { make, model, fuel, trans, limit, offset, p_min_price, p_max_price }
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  // Next 15: searchParams is async
  const spObj = await searchParams
  const filters = parseFilters(spObj)

  // Get Supabase (server) and guard for missing envs in dev
  const supabase = await supabaseServer()
  if (!supabase) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Shiftbox Vehicles</h1>
        <p className="text-sm text-muted-foreground">
          Supabase environment variables are missing. Set{" "}
          <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>apps/website/.env.local</code>.
        </p>
      </main>
    )
  }

  // Call your RPC (matches SQL function signature)
  const { data, error } = await supabase.rpc("list_public_sales", {
    p_make: filters.make,
    p_model: filters.model,
    p_fuel: filters.fuel,
    p_trans: filters.trans,
    p_min_price: filters.p_min_price,
    p_max_price: filters.p_max_price,
    p_limit: filters.limit,
    p_offset: filters.offset,
  })

  if (error) {
    return (
      <main className="container mx-auto px-4 py-12">
        <h1 className="text-2xl font-semibold mb-4">Shiftbox Vehicles</h1>
        <pre className="text-sm text-red-600">{JSON.stringify(error, null, 2)}</pre>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-12 space-y-6">
      <h1 className="text-2xl font-semibold">Shiftbox Vehicles</h1>
      {(!data || data.length === 0) ? (
        <p className="text-sm text-muted-foreground">No vehicles found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((v: any) => (
            <li key={v.id} className="rounded-lg border p-4">
              <div className="flex items-baseline justify-between">
                <h2 className="font-medium">{v.make} {v.model}</h2>
                {typeof v.price === "number" || (typeof v.price === "string" && v.price) ? (
                  <span className="text-primary font-semibold">
                    £{Number(v.price).toLocaleString("en-GB", { maximumFractionDigits: 0 })}
                  </span>
                ) : null}
              </div>
              <div className="text-sm text-muted-foreground">
                {v.year ?? "—"} • {v.mileage ? `${v.mileage.toLocaleString()} mi` : "—"} • {v.fuel_type ?? "—"}
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {v.dvla_colour ? `Colour: ${v.dvla_colour}` : null}
              </div>
              <div className="mt-3">
                <Link href={`/vehicles/${v.id}`} className="text-sm underline">View details</Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
