import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

async function getVehicles() {
  const cookieStore = cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).single()

  if (!adminUser) {
    redirect("/admin/unauthorized")
  }

  const { data: vehicles, error } = await supabase
    .from("vehicles")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching vehicles:", error)
    return []
  }

  return vehicles || []
}

export default async function VehiclesManagement() {
  const vehicles = await getVehicles()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Vehicle Management</h1>
              <p className="text-gray-600">Manage your vehicle inventory</p>
            </div>
            <div className="flex gap-3">
              <Link href="/admin/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Link href="/admin/vehicles/add">
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Vehicle
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {vehicles.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">No vehicles found</h3>
                <p className="text-gray-600 mb-4">Get started by adding your first vehicle to the inventory.</p>
                <Link href="/admin/vehicles/add">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Your First Vehicle
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vehicles.map((vehicle) => (
              <Card key={vehicle.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="aspect-video relative mb-3 rounded-lg overflow-hidden bg-gray-100">
                    {vehicle.image_url ? (
                      <Image
                        src={vehicle.image_url || "/placeholder.svg"}
                        alt={`${vehicle.make} ${vehicle.model}`}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-gray-400">No Image</div>
                    )}
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {vehicle.make} {vehicle.model}
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        {vehicle.year} • {vehicle.registration || "No Reg"}
                      </p>
                    </div>
                    <Badge variant={vehicle.status === "available" ? "default" : "secondary"}>{vehicle.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Price:</span>
                      <span className="font-medium">£{vehicle.price?.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Mileage:</span>
                      <span className="font-medium">{vehicle.mileage?.toLocaleString()} miles</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fuel:</span>
                      <span className="font-medium">{vehicle.fuel_type}</span>
                    </div>
                    {vehicle.bhp && (
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">BHP:</span>
                        <span className="font-medium">{vehicle.bhp}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <Link href={`/vehicles/${vehicle.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/vehicles/edit/${vehicle.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                    </Link>
                    <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700 bg-transparent">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
