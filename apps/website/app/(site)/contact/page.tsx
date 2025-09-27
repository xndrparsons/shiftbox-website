// @ts-nocheck
import { Suspense } from "react"
import { submitContact } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export const metadata = {
  title: "Contact | Shiftbox",
  description: "Get in touch to enquire about a vehicle, servicing, or detailing.",
}

function ContactForm() {
  // Progressive enhancement: capture UA & referer via hidden inputs
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : ""
  const rf = typeof document !== "undefined" ? document.referrer : ""

  return (
    <form action={submitContact} className="space-y-4 max-w-xl">
      {/* honeypot field (hidden) */}
      <input type="text" name="company" className="hidden" tabIndex={-1} autoComplete="off" />

      <div className="grid gap-2">
        <Label htmlFor="name">Name*</Label>
        <Input id="name" name="name" required placeholder="Your name" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="email">Email*</Label>
        <Input id="email" name="email" type="email" required placeholder="you@example.com" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="phone">Phone</Label>
        <Input id="phone" name="phone" type="tel" placeholder="07xxx xxxxxx" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="subject">Subject</Label>
        <Input id="subject" name="subject" placeholder="Vehicle enquiry / Service booking" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Message*</Label>
        <textarea
          id="message"
          name="message"
          required
          rows={6}
          placeholder="How can we help?"
          className="w-full rounded-md border bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      {/* capture UA + referer for context */}
      <input type="hidden" name="ua" value={ua} />
      <input type="hidden" name="rf" value={rf} />

      <Button type="submit" className="w-full sm:w-auto">Send</Button>
      <p className="text-xs text-muted-foreground mt-2">* Required fields</p>
    </form>
  )
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>
}) {
  const sp = await searchParams
  const success = sp?.success === "1"

  return (
    <main className="container mx-auto px-4 py-12 space-y-8">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="text-muted-foreground">
          Based near Kendal (North-West). Enquire about a vehicle, servicing, or detailing.
        </p>
      </header>

      <div className="grid gap-8 md:grid-cols-3">
        <section className="md:col-span-2">
          {success ? (
            <div className="rounded-md border p-4">
              <h2 className="font-semibold mb-1">Thank you — we’ve received your message.</h2>
              <p className="text-sm text-muted-foreground">
                We’ll get back to you shortly. If it’s urgent, please call us.
              </p>
            </div>
          ) : (
            <Suspense fallback={<div className="h-40 rounded-md border animate-pulse" />}>
              {/* @ts-expect-error Async Server Component boundary */}
              <ContactForm />
            </Suspense>
          )}
        </section>

        <aside className="rounded-md border p-4 space-y-3 text-sm">
          <div>
            <div className="font-medium">Phone</div>
            <div className="text-muted-foreground">07xxx xxxxxx</div>
          </div>
          <div>
            <div className="font-medium">Email</div>
            <div className="text-muted-foreground">hello@shiftbox.uk</div>
          </div>
          <div>
            <div className="font-medium">Location</div>
            <div className="text-muted-foreground">Near Kendal, North-West England</div>
          </div>
          <div>
            <div className="font-medium">Hours</div>
            <div className="text-muted-foreground">Mon–Fri 09:00–17:30</div>
          </div>
        </aside>
      </div>
    </main>
  )
}
