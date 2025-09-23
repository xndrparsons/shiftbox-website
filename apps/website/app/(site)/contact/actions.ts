"use server"

import { redirect } from "next/navigation"
import { supabaseServer } from "@/lib/supabase/server"

type FormState = {
  ok: boolean
  error?: string
}

export async function submitContact(prevState: FormState, formData: FormData): Promise<FormState> {
  // Honeypot (bot trap)
  const hp = (formData.get("company") as string | null)?.trim()
  if (hp) return { ok: false, error: "spam" }

  const name = (formData.get("name") as string | null)?.trim() || ""
  const email = (formData.get("email") as string | null)?.trim() || ""
  const phone = (formData.get("phone") as string | null)?.trim() || ""
  const subject = (formData.get("subject") as string | null)?.trim() || ""
  const message = (formData.get("message") as string | null)?.trim() || ""

  // Basic validation
  if (!name || !email || !message) {
    return { ok: false, error: "Please fill in name, email, and your message." }
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return { ok: false, error: "Please enter a valid email address." }
  }

  const supabase = await supabaseServer()
  if (!supabase) {
    return { ok: false, error: "Server configuration missing." }
  }

  // Optional headers (best effort)
  const userAgent = (formData.get("ua") as string | null) ?? ""
  const referer = (formData.get("rf") as string | null) ?? ""

  const { error } = await supabase.from("contact_messages").insert([
    {
      name, email, phone, subject, message,
      user_agent: userAgent,
      referer,
    }
  ])

  if (error) {
    console.warn("contact insert error", error)
    return { ok: false, error: "Failed to send message. Please try again." }
  }

  // Redirect to same page with success for a clean post/redirect/get flow
  redirect("/contact?success=1")
}
