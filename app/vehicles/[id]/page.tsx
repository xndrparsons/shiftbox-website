import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Gauge, Fuel, Settings, Car, Palette, Hash, DoorOpen } from "lucide-react"
import Link from "next/link"

interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  price: number
  mileage: number | null
  fuel_type: string | null
  transmission: string | null
  body_type: string | null
  color: string | null
  engine_size: string | null
  doors: number | null
  description: string | null
  features: string[] | null
  images: string[] | null
  status: string
}

export default async function VehicleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: vehicle, error } = await supabase.from("vehicles").select("*").eq("id", id).single()

  if (error || !vehicle) {
    notFound()
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatMileage = (mileage: number | null) => {
    if (!mileage) return "N/A"
    return new Intl.NumberFormat("en-GB").format(mileage)
  }

  const vehicleTitle = `${vehicle.make} ${vehicle.model}`

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button variant="outline" asChild>
            <Link href="/vehicles">← Back to Vehicles</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={
                  vehicle.images?.[0] || `/placeholder.svg?height=400&width=600&query=${vehicle.make} ${vehicle.model}`
                }
                alt={vehicleTitle}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge variant={vehicle.status === "available" ? "default" : "secondary"}>
                  {vehicle.status === "available" ? "Available" : "Sold"}
                </Badge>
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-balance">{vehicleTitle}</h1>
              <div className="text-4xl font-bold text-primary mb-4">{formatPrice(vehicle.price)}</div>
              {vehicle.description && <p className="text-muted-foreground text-pretty">{vehicle.description}</p>}
            </div>

            {/* Key Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Key Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Year: {vehicle.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Gauge className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Mileage: {formatMileage(vehicle.mileage)} miles</span>
                  </div>
                  {vehicle.fuel_type && (
                    <div className="flex items-center space-x-2">
                      <Fuel className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Fuel: {vehicle.fuel_type}</span>
                    </div>
                  )}
                  {vehicle.transmission && (
                    <div className="flex items-center space-x-2">
                      <Settings className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Transmission: {vehicle.transmission}</span>
                    </div>
                  )}
                  {vehicle.body_type && (
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Body: {vehicle.body_type}</span>
                    </div>
                  )}
                  {vehicle.color && (
                    <div className="flex items-center space-x-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Color: {vehicle.color}</span>
                    </div>
                  )}
                  {vehicle.engine_size && (
                    <div className="flex items-center space-x-2">
                      <Hash className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Engine: {vehicle.engine_size}</span>
                    </div>
                  )}
                  {vehicle.doors && (
                    <div className="flex items-center space-x-2">
                      <DoorOpen className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Doors: {vehicle.doors}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            {vehicle.features && vehicle.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features & Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicle.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Actions */}
            <div className="space-y-3">
              <Button size="lg" className="w-full" asChild>
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button variant="outline" size="lg" className="w-full bg-transparent" asChild>
                <Link href="/contact">Book a Viewing</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
