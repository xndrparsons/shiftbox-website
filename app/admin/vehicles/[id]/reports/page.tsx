import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, FileText, Calendar, User, Eye } from "lucide-react"
import Link from "next/link"

async function getVehicleReports(vehicleId: string) {
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

  // Get vehicle details
  const { data: vehicle, error: vehicleError } = await supabase
    .from("vehicles")
    .select("*")
    .eq("id", vehicleId)
    .single()

  if (vehicleError || !vehicle) {
    notFound()
  }

  // Get mechanical reports
  const { data: reports, error: reportsError } = await supabase
    .from("vehicle_mechanical_reports")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("created_at", { ascending: false })

  if (reportsError) {
    console.error("Error fetching reports:", reportsError)
    return { vehicle, reports: [] }
  }

  return { vehicle, reports: reports || [] }
}

export default async function VehicleReportsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { vehicle, reports } = await getVehicleReports(id)

  const getGradeBadgeVariant = (grade: string) => {
    switch (grade?.toLowerCase()) {
      case "excellent":
        return "default"
      case "good":
        return "secondary"
      case "fair":
        return "outline"
      case "poor":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mechanical Reports</h1>
              <p className="text-gray-600 dark:text-gray-300">
                {vehicle.make} {vehicle.model} ({vehicle.year})
              </p>
            </div>
            <div className="flex gap-3">
              <Link href={`/admin/vehicles/${id}`}>
                <Button variant="outline">Back to Vehicle</Button>
              </Link>
              <Link href={`/admin/vehicles/${id}/reports/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Report
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {reports.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No mechanical reports found</h3>
                <p className="text-gray-600 mb-4">Create the first mechanical health report for this vehicle.</p>
                <Link href={`/admin/vehicles/${id}/reports/new`}>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reports.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">Mechanical Report</CardTitle>
                    <Badge variant={getGradeBadgeVariant(report.overall_grade)}>{report.overall_grade || "N/A"}</Badge>
                  </div>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(report.created_at).toLocaleDateString()}</span>
                    </div>
                    {report.inspector_name && (
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{report.inspector_name}</span>
                      </div>
                    )}
                    {report.odometer_reading && (
                      <div className="flex items-center gap-2">
                        <span className="text-xs">📊</span>
                        <span>{report.odometer_reading.toLocaleString()} miles</span>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {report.additional_notes && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{report.additional_notes}</p>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/admin/vehicles/${id}/reports/${report.id}`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </Link>
                    <Link href={`/admin/vehicles/${id}/reports/${report.id}/edit`} className="flex-1">
                      <Button variant="outline" size="sm" className="w-full bg-transparent">
                        Edit
                      </Button>
                    </Link>
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
