import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Gauge } from "lucide-react"

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

interface VehicleCardProps {
  vehicle: Vehicle
}

export default function VehicleCard({ vehicle }: VehicleCardProps) {
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
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative aspect-[4/3]">
        <Image
          src={vehicle.images?.[0] || `/placeholder.svg?height=300&width=400&query=${vehicle.make} ${vehicle.model}`}
          alt={vehicleTitle}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge variant={vehicle.status === "available" ? "default" : "secondary"}>
            {vehicle.status === "available" ? "Available" : "Sold"}
          </Badge>
        </div>
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 text-balance">{vehicleTitle}</h3>
        <div className="text-2xl font-bold text-primary mb-3">{formatPrice(vehicle.price)}</div>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.year}</span>
          </div>
          <div className="flex items-center space-x-1">
            <Gauge className="h-4 w-4" />
            <span>{formatMileage(vehicle.mileage)} miles</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full">
          <Link href={`/vehicles/${vehicle.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
