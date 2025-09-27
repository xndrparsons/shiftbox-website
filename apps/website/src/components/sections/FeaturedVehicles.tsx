// apps/website/src/components/sections/FeaturedVehicles.tsx
import Link from "next/link"

type Vehicle = {
  id: string
  make: string | null
  model: string | null
  year: number | null
  price: number | string | null
  mileage: number | null
  fuel_type: string | null
  dvla_colour?: string | null
}

export default function FeaturedVehicles({ vehicles }: { vehicles: Vehicle[] }) {
  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Featured vehicles</h2>
          <p className="text-sm text-muted-foreground">
            Hand-picked stock currently available.
          </p>
        </div>
        <Link href="/vehicles" className="text-sm underline">
          View all
        </Link>
      </div>

      {(!vehicles || vehicles.length === 0) ? (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">
          No featured vehicles yet. Check back soon.
        </div>
      ) : (
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => {
            const title = [v.make, v.model].filter(Boolean).join(" ")
            const priceNum =
              typeof v.price === "string" ? Number(v.price) : v.price ?? null
            const price = priceNum != null
              ? `£${priceNum.toLocaleString("en-GB", { maximumFractionDigits: 0 })}`
              : "—"

            return (
              <li key={v.id} className="rounded-lg border p-4">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-medium">{title || "Vehicle"}</h3>
                  <span className="text-primary font-semibold">{price}</span>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  {[v.year ?? "—",
                    v.mileage ? `${v.mileage.toLocaleString()} mi` : "—",
                    v.fuel_type ?? "—"]
                    .join(" • ")}
                </div>
                {v.dvla_colour && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Colour: {v.dvla_colour}
                  </div>
                )}
                <div className="mt-3">
                  <Link href={`/vehicles/${v.id}`} className="text-sm underline">
                    View details
                  </Link>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}