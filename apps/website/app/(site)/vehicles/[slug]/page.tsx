import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { Metadata } from "next"

import { supabaseServer } from "@shiftbox/auth/supabase.server" // shared server client
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Calendar, Gauge, Fuel, Settings, Car, Palette, Hash, DoorOpen, Shield,
  AlertTriangle, CheckCircle, Star,
} from "lucide-react"

// --- Utils (we can move these to /lib/utils later) ---
const formatPrice = (price: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 0 }).format(price)

const formatMileage = (mileage: number | null) =>
  mileage ? new Intl.NumberFormat("en-GB").format(mileage) : "N/A"

const getConditionColor = (condition?: string) => {
  switch (condition?.toLowerCase()) {
    case "excellent": return "text-green-600"
    case "very good": return "text-green-500"
    case "good": return "text-blue-600"
    case "fair": return "text-yellow-600"
    case "poor": return "text-red-600"
    default: return "text-muted-foreground"
  }
}

const getConditionIcon = (condition?: string) => {
  switch (condition?.toLowerCase()) {
    case "excellent": return <CheckCircle className="h-4 w-4 text-green-600" />
    case "very good": return <CheckCircle className="h-4 w-4 text-green-500" />
    case "good": return <CheckCircle className="h-4 w-4 text-blue-600" />
    case "fair": return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    case "poor": return <AlertTriangle className="h-4 w-4 text-red-600" />
    default: return null
  }
}

// Revalidate this page periodically (and we can tag-revalidate on publish/price change)
export const revalidate = 60

// Per-vehicle SEO based on slug
export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const supabase = supabaseServer()
  const { data } = await supabase.rpc("get_vehicle_full_by_slug", { p_slug: params.slug })
  if (!data) return {}

  const title = `${data.make} ${data.model} ${data.registration ?? ""} | Shiftbox`.trim()
  const description =
    data.description_md?.slice(0, 160) ??
    `Used ${data.make} ${data.model} available at Shiftbox.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: data.hero_image_url ? [{ url: data.hero_image_url, width: 1200, height: 630 }] : [],
    },
  }
}

export default async function VehicleDetailPage({ params }: { params: { slug: string } }) {
  const supabase = supabaseServer()

  // Fetch via RPC scoped to published vehicles (RLS-friendly)
  const { data: vehicle, error } = await supabase.rpc("get_vehicle_full_by_slug", { p_slug: params.slug })
  if (error) throw error
  if (!vehicle) notFound()

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
          {/* Image/Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
              <Image
                src={vehicle.images?.[0] || `/placeholder.svg?height=400&width=600&query=${vehicle.make} ${vehicle.model}`}
                alt={vehicleTitle}
                fill
                className="object-cover"
                sizes="(min-width: 1024px) 50vw, 100vw"
                priority
              />
              <div className="absolute top-4 right-4">
                <Badge variant={vehicle.status === "available" ? "default" : "secondary"}>
                  {vehicle.status === "available" ? "Available" : "Sold"}
                </Badge>
              </div>
              {vehicle.overall_condition_rating && (
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-current" />
                    {vehicle.overall_condition_rating}/5
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-balance">{vehicleTitle}</h1>
              {typeof vehicle.price === "number" && (
                <div className="text-4xl font-bold text-primary mb-4">{formatPrice(vehicle.price)}</div>
              )}
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
                  {(vehicle as any).previous_owners != null && (
                    <div className="flex items-center space-x-2">
                      <Car className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Previous Owners: {(vehicle as any).previous_owners}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* DVLA */}
            {vehicle.dvla_registration_number && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    DVLA Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Registration:</span>
                      <p className="font-medium">{vehicle.dvla_registration_number}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Tax Status:</span>
                      <p className="font-medium">{vehicle.dvla_tax_status || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">MOT Status:</span>
                      <p className="font-medium">{vehicle.dvla_mot_status || "N/A"}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">MOT Expiry:</span>
                      <p className="font-medium">{vehicle.dvla_mot_expiry_date || "N/A"}</p>
                    </div>
                    {"dvla_engine_capacity" in vehicle && vehicle.dvla_engine_capacity && (
                      <div>
                        <span className="text-sm text-muted-foreground">Engine Capacity:</span>
                        <p className="font-medium">{vehicle.dvla_engine_capacity}cc</p>
                      </div>
                    )}
                    {("dvla_euro_status" in vehicle) && vehicle.dvla_euro_status && (
                      <div>
                        <span className="text-sm text-muted-foreground">Euro Status:</span>
                        <p className="font-medium">{vehicle.dvla_euro_status}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Condition */}
            {(vehicle.exterior_paintwork_condition ||
              vehicle.interior_condition ||
              vehicle.engine_condition ||
              vehicle.service_history_status) && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Vehicle Condition
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {vehicle.exterior_paintwork_condition && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Exterior Paintwork:</span>
                        <div className="flex items-center gap-1">
                          {getConditionIcon(vehicle.exterior_paintwork_condition)}
                          <span className={`font-medium capitalize ${getConditionColor(vehicle.exterior_paintwork_condition)}`}>
                            {vehicle.exterior_paintwork_condition}
                          </span>
                        </div>
                      </div>
                    )}
                    {vehicle.interior_condition && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Interior:</span>
                        <div className="flex items-center gap-1">
                          {getConditionIcon(vehicle.interior_condition)}
                          <span className={`font-medium capitalize ${getConditionColor(vehicle.interior_condition)}`}>
                            {vehicle.interior_condition}
                          </span>
                        </div>
                      </div>
                    )}
                    {vehicle.engine_condition && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Engine:</span>
                        <div className="flex items-center gap-1">
                          {getConditionIcon(vehicle.engine_condition)}
                          <span className={`font-medium capitalize ${getConditionColor(vehicle.engine_condition)}`}>
                            {vehicle.engine_condition}
                          </span>
                        </div>
                      </div>
                    )}
                    {vehicle.service_history_status && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Service History:</span>
                        <span className="font-medium capitalize">{vehicle.service_history_status}</span>
                      </div>
                    )}
                  </div>

                  {vehicle.presence_of_rust && Array.isArray(vehicle.rust_locations) && vehicle.rust_locations.length > 0 && (
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-600" />
                        <span className="text-sm font-medium text-yellow-600">Rust Present</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {vehicle.rust_locations.map((location: string, index: number) => (
                          <Badge key={index} variant="outline" className="text-xs border-yellow-300 text-yellow-700">
                            {location}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {vehicle.accident_history && (
                    <div className="border-t pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                        <span className="text-sm font-medium text-orange-600">Previous Accident History</span>
                      </div>
                      {vehicle.accident_details && (
                        <p className="text-sm text-muted-foreground">{vehicle.accident_details}</p>
                      )}
                    </div>
                  )}

                  {vehicle.condition_notes && (
                    <div className="border-t pt-4">
                      <span className="text-sm text-muted-foreground">Additional Notes:</span>
                      <p className="text-sm mt-1">{vehicle.condition_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Features */}
            {Array.isArray(vehicle.features) && vehicle.features.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Features & Equipment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {vehicle.features.map((feature: string, index: number) => (
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
