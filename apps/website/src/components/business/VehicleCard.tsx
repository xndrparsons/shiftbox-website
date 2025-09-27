type Vehicle = {
  id: string
  slug?: string | null
  make: string
  model: string
  year: number | null
  price: number | null
  mileage: number | null
  lead_image_url?: string | null
  status_code?: string | null
}

export default function VehicleCard({ v }: { v: Vehicle }) {
  const href = v.slug ? `/vehicles/${v.slug}` : `/vehicles/${v.id}`
  const price = typeof v.price === "number" ? `£${Math.round(v.price).toLocaleString("en-GB")}` : "POA"

  return (
    <a href={href} className="group rounded-xl border overflow-hidden hover:shadow-sm transition">
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt={`${v.make} ${v.model}`}
          src={v.lead_image_url ?? "/placeholder.svg?height=400&width=600"}
          className="w-full h-full object-cover group-hover:scale-[1.02] transition"
        />
      </div>
      <div className="p-4 space-y-1">
        <div className="flex items-center justify-between">
          <div className="font-medium">{v.make} {v.model}{v.year ? ` · ${v.year}` : ""}</div>
          <div className="text-primary font-semibold">{price}</div>
        </div>
        {typeof v.mileage === "number" && (
          <div className="text-xs text-muted-foreground">{v.mileage.toLocaleString()} miles</div>
        )}
        {v.status_code && (
          <div className="mt-2 inline-flex text-[10px] rounded-full border px-2 py-0.5 uppercase tracking-wide">
            {v.status_code}
          </div>
        )}
      </div>
    </a>
  )
}
