import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Car, MessageSquare, Users, Plus } from "lucide-react"
import Link from "next/link"

async function getAdminData() {
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

  // Get dashboard stats
  const [vehiclesResult, inquiriesResult] = await Promise.all([
    supabase.from("vehicles").select("id, status").eq("status", "available"),
    supabase
      .from("contact_inquiries")
      .select("id, created_at")
      .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
  ])

  return {
    user,
    adminUser,
    vehicleCount: vehiclesResult.data?.length || 0,
    recentInquiries: inquiriesResult.data?.length || 0,
  }
}

export default async function AdminDashboard() {
  const { user, adminUser, vehicleCount, recentInquiries } = await getAdminData()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome back, {adminUser.name}</p>
            </div>
            <form action="/auth/signout" method="post">
              <Button variant="outline">Sign Out</Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Vehicles</CardTitle>
              <Car className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{vehicleCount}</div>
              <p className="text-xs text-muted-foreground">Currently listed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentInquiries}</div>
              <p className="text-xs text-muted-foreground">Last 30 days</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1</div>
              <p className="text-xs text-muted-foreground">Active administrators</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Vehicle
              </CardTitle>
              <CardDescription>Add a new vehicle to your inventory with automatic spec lookup</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/vehicles/add">
                <Button className="w-full">Add Vehicle</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Manage Vehicles
              </CardTitle>
              <CardDescription>View, edit, and manage your vehicle inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/vehicles">
                <Button variant="outline" className="w-full bg-transparent">
                  Manage Vehicles
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                View Inquiries
              </CardTitle>
              <CardDescription>Review and respond to customer inquiries</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/admin/inquiries">
                <Button variant="outline" className="w-full bg-transparent">
                  View Inquiries
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
