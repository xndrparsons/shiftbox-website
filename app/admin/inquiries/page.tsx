import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, Phone, Calendar, ArrowLeft } from "lucide-react"
import Link from "next/link"

async function getInquiries() {
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

  const { data: inquiries, error } = await supabase
    .from("contact_inquiries")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching inquiries:", error)
    return []
  }

  return inquiries || []
}

export default async function InquiriesManagement() {
  const inquiries = await getInquiries()

  const getInquiryTypeColor = (type: string) => {
    switch (type) {
      case "general":
        return "bg-blue-100 text-blue-800"
      case "vehicle_inquiry":
        return "bg-green-100 text-green-800"
      case "service_booking":
        return "bg-purple-100 text-purple-800"
      case "complaint":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Inquiries</h1>
              <p className="text-gray-600">Manage customer contact inquiries and requests</p>
            </div>
            <Link href="/admin/dashboard">
              <Button variant="outline">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {inquiries.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No inquiries yet</h3>
              <p className="text-gray-600">Customer inquiries will appear here when they contact you.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {inquiries.map((inquiry) => (
              <Card key={inquiry.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          {inquiry.email}
                        </div>
                        {inquiry.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            {inquiry.phone}
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {formatDate(inquiry.created_at)}
                        </div>
                      </div>
                    </div>
                    <Badge className={getInquiryTypeColor(inquiry.inquiry_type)}>
                      {inquiry.inquiry_type.replace("_", " ")}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">From: {inquiry.name}</h4>
                    <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <a href={`mailto:${inquiry.email}?subject=Re: ${inquiry.subject}`}>Reply via Email</a>
                    </Button>
                    {inquiry.phone && (
                      <Button variant="outline" size="sm" asChild>
                        <a href={`tel:${inquiry.phone}`}>Call Customer</a>
                      </Button>
                    )}
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
