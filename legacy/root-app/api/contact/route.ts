import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message, inquiryType } = body

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()

    // Insert contact inquiry into database
    const { data, error } = await supabase.from("contact_inquiries").insert({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      inquiry_type: inquiryType || "general",
      status: "new",
    })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Failed to save inquiry" }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: "Inquiry submitted successfully" })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
