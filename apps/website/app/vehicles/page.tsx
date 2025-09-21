import { createClient } from "@/lib/supabase/server"
import VehicleCard from "@/components/VehicleCard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter } from "lucide-react"

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

export default async function VehiclesPage() {
  const supabase = await createClient()

  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .eq("status", "available")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching vehicles:", error)
    return <div>Error loading vehicles</div>
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4 text-balance">Our Vehicle Collection</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              Discover our carefully selected range of premium used vehicles, each one thoroughly inspected and prepared
              to the highest standards.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-4 p-6 bg-background rounded-lg shadow-sm">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input placeholder="Search by make, model, or keyword..." className="pl-10" />
              </div>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Make" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Makes</SelectItem>
                  <SelectItem value="bmw">BMW</SelectItem>
                  <SelectItem value="audi">Audi</SelectItem>
                  <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Price Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Prices</SelectItem>
                  <SelectItem value="0-20000">Under £20,000</SelectItem>
                  <SelectItem value="20000-30000">£20,000 - £30,000</SelectItem>
                  <SelectItem value="30000-50000">£30,000 - £50,000</SelectItem>
                  <SelectItem value="50000+">£50,000+</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-semibold">{vehicles?.length || 0} Vehicles Available</h2>
            <Select>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="mileage">Lowest Mileage</SelectItem>
                <SelectItem value="year">Newest Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {vehicles && vehicles.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-xl text-muted-foreground mb-4">No vehicles available at the moment.</p>
              <p className="text-muted-foreground">Please check back soon for new arrivals.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
