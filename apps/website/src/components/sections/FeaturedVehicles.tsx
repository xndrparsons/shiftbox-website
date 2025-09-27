import VehicleCard from "@/components/business/VehicleCard"

type Props = {
  vehicles: Array<{
    id: string; slug?: string | null; make: string; model: string; year: number | null
    price: number | null; mileage: number | null; lead_image_url?: string | null; status_code?: string | null
  }>
}

export default function FeaturedVehicles({ vehicles }: Props) {
  if (!vehicles?.length) return null
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <h2 className="text-2xl font-semibold">Featured Vehicles</h2>
          <a href="/vehicles" className="text-sm underline">View all</a>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {vehicles.slice(0, 3).map((v) => <VehicleCard key={v.id} v={v} />)}
        </div>
      </div>
    </section>
  )
}
