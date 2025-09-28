import Link from "next/link"

type Vehicle = {
  id: string
  make: string
  model: string
  year: number | null
  price: number | string | null
  mileage: number | null
  fuel_type?: string | null
}

export default function FeaturedVehicles({ items = [] as Vehicle[] }) {
  if (!items.length) {
    return null
  }
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-heading text-3xl md:text-4xl">Featured Vehicles</h2>
        <Link href="/vehicles" className="text-sm underline opacity-80 hover:opacity-100">View all</Link>
      </div>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(v => (
          <li key={v.id} className="rounded-xl border border-border/60 bg-background/60 p-4">
            <div className="flex items-baseline justify-between">
              <h3 className="font-medium">{v.make} {v.model}</h3>
              {v.price ? <span className="font-semibold">£{Number(v.price).toLocaleString("en-GB",{maximumFractionDigits:0})}</span> : <span className="opacity-70">POA</span>}
            </div>
            <p className="mt-1 text-sm opacity-70">
              {(v.year ?? "—")} • {v.mileage ? `${v.mileage.toLocaleString()} mi` : "—"} • {v.fuel_type ?? "—"}
            </p>
            <div className="mt-3">
              <Link href={`/vehicles/${v.id}`} className="text-sm underline">View details</Link>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
