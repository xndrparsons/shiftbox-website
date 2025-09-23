import Link from "next/link"

type VehicleCardProps = {
  vehicle: {
    id: string
    make?: string | null
    model?: string | null
    year?: number | null
    price?: number | string | null
    mileage?: number | null
    fuel_type?: string | null
    dvla_colour?: string | null
  }
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
  const { id, make, model, year, price, mileage, fuel_type, dvla_colour } = vehicle
  const priceDisplay =
    price != null && !Number.isNaN(Number(price))
      ? `£${Number(price).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`
      : "—"
  const mileageDisplay = mileage != null ? `${mileage.toLocaleString()} mi` : "—"

  return (
    <article className="rounded-lg border p-4 hover:shadow-sm transition">
      <header className="flex items-baseline justify-between">
        <h3 className="font-medium">{make} {model}</h3>
        <span className="text-primary font-semibold">{priceDisplay}</span>
      </header>

      <p className="text-sm text-muted-foreground">
        {year ?? "—"} • {mileageDisplay} • {fuel_type ?? "—"}
      </p>

      {dvla_colour && (
        <p className="mt-1 text-xs text-muted-foreground">Colour: {dvla_colour}</p>
      )}

      <footer className="mt-3">
        <Link href={`/vehicles/${id}`} className="text-sm underline">View details</Link>
      </footer>
    </article>
  )
}
