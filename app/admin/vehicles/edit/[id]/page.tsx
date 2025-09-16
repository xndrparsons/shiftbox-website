import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect, notFound } from "next/navigation"
import VehicleForm from "@/components/admin/VehicleForm"

async function getVehicle(id: string) {
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

  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).single()

  if (!adminUser) {
    redirect("/admin/unauthorized")
  }

  const { data: vehicle, error } = await supabase.from("vehicles").select("*").eq("id", id).single()

  if (error || !vehicle) {
    notFound()
  }

  return vehicle
}

export default async function EditVehicle({ params }: { params: { id: string } }) {
  const vehicle = await getVehicle(params.id)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-2xl font-bold text-gray-900">Edit Vehicle</h1>
            <p className="text-gray-600">Update vehicle details and specifications</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <VehicleForm initialData={vehicle} isEditing vehicleId={params.id} />
      </div>
    </div>
  )
}
