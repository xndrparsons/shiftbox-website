import type { Metadata } from "next"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Contact — Shiftbox",
  description: "Get in touch with Shiftbox. Quality cars & expert service.",
}

/**
 * Server action for <form action={...}>.
 * - Single param (FormData)
 * - Returns Promise<void> to satisfy React's action typing
 */
export async function submitContact(formData: FormData): Promise<void> {
  "use server"
  // Extract fields
  const name = (formData.get("name") || "").toString().trim()
  const email = (formData.get("email") || "").toString().trim()
  const message = (formData.get("message") || "").toString().trim()

  // TODO: send email / persist to DB / notify, etc.
  console.log("[contact] incoming:", { name, email, message })

  // Optionally: revalidatePath("/") or redirect("/contact?sent=1")
  // For now we deliberately return void per <form action> typing.
}

export default function ContactPage() {
  return (
    <main className="container mx-auto px-4 py-12 space-y-6">
      <header>
        <h1 className="text-2xl font-heading tracking-wide">Contact</h1>
        <p className="text-sm text-muted-foreground">
          Have a question about a vehicle or our services? Send us a message.
        </p>
      </header>

      <form action={submitContact} className="space-y-4 max-w-xl">
        <div className="grid gap-2">
          <label htmlFor="name" className="text-sm">Name</label>
          <input id="name" name="name" required className="border rounded-md h-10 px-3 bg-background" />
        </div>

        <div className="grid gap-2">
          <label htmlFor="email" className="text-sm">Email</label>
          <input id="email" name="email" type="email" required className="border rounded-md h-10 px-3 bg-background" />
        </div>

        <div className="grid gap-2">
          <label htmlFor="message" className="text-sm">Message</label>
          <textarea id="message" name="message" rows={5} required className="border rounded-md px-3 py-2 bg-background" />
        </div>

        <Button type="submit">Send Message</Button>
      </form>
    </main>
  )
}
