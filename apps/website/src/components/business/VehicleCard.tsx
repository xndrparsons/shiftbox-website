"use client"

type Vehicle = {
  id: string
  slug?: string | null
  make?: string | null
  model?: string | null
  year?: number | null
  price?: number | string | null
  mileage?: number | null
  fuel_type?: string | null
  dvla_colour?: string | null
  images?: string[] | null
}

export default function VehicleCard({ v }: { v?: Vehicle }) {
  if (!v) return null

  const href = v.slug ? `/vehicles/${v.slug}` : `/vehicles/${v.id}`

  const priceNum =
    typeof v.price === "string" ? Number(v.price) : typeof v.price === "number" ? v.price : null
  const price =
    priceNum !== null && !Number.isNaN(priceNum)
      ? `£${Math.round(priceNum).toLocaleString("en-GB")}`
      : "POA"

  const title = [v.make, v.model].filter(Boolean).join(" ") || "Vehicle"
  const subtitle = [v.year ?? "—", v.mileage ? `${v.mileage.toLocaleString()} mi` : "—", v.fuel_type ?? "—"]
    .filter(Boolean)
    .join(" • ")

  return (
    <a href={href} className="block rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-baseline justify-between">
        <h3 className="font-medium">{title}</h3>
        <span className="text-primary font-semibold">{price}</span>
      </div>
      <div className="text-sm text-muted-foreground">{subtitle}</div>
      {v.dvla_colour && <div className="mt-2 text-xs text-muted-foreground">Colour: {v.dvla_colour}</div>}
    </a>
  )
}
