import { notFound } from "next/navigation"
import Link from "next/link"
import { supabaseServer } from "@/lib/supabase/server"

export const revalidate = 60

export default async function VehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const supabase = await supabaseServer()
  if (!supabase) {
    return (
      <main className="container mx-auto px-4 py-12 space-y-4">
        <h1 className="text-2xl font-semibold">Vehicle</h1>
        <p className="text-sm text-muted-foreground">
          Supabase env vars missing. Set <code>NEXT_PUBLIC_SUPABASE_URL</code> and{" "}
          <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> in <code>apps/website/.env.local</code>.
        </p>
        <Link href="/" className="underline text-sm">← Back to vehicles</Link>
      </main>
    )
  }

  const { data, error } = await supabase.rpc("get_public_vehicle", { p_id: slug })
  if (error || !data || data.length === 0) {
    notFound()
  }
  const v = data[0]

  const priceDisplay =
    v.price != null && !Number.isNaN(Number(v.price))
      ? `£${Number(v.price).toLocaleString("en-GB", { maximumFractionDigits: 0 })}`
      : "—"
  const mileageDisplay =
    v.mileage != null ? `${Number(v.mileage).toLocaleString()} mi` : "—"

  return (
    <main className="container mx-auto px-4 py-12 space-y-8">
      <div>
        <Link href="/" className="text-sm underline">← Back to vehicles</Link>
      </div>

      <header className="space-y-2">
        <h1 className="text-3xl font-bold">
          {v.make} {v.model}
        </h1>
        <p className="text-muted-foreground">
          {v.year ?? "—"} • {mileageDisplay} • {v.fuel_type ?? v.dvla_fuel_type ?? "—"}
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 rounded-lg border p-4">
          <h2 className="font-semibold mb-2">Overview</h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><dt className="text-muted-foreground">Price</dt><dd>{priceDisplay}</dd></div>
            <div><dt className="text-muted-foreground">Registration</dt><dd>{v.registration ?? v.dvla_registration_number ?? "—"}</dd></div>
            <div><dt className="text-muted-foreground">Fuel</dt><dd>{v.fuel_type ?? v.dvla_fuel_type ?? "—"}</dd></div>
            <div><dt className="text-muted-foreground">Transmission</dt><dd>{v.transmission ?? "—"}</dd></div>
            <div><dt className="text-muted-foreground">Colour</dt><dd>{v.dvla_colour ?? "—"}</dd></div>
            <div><dt className="text-muted-foreground">Engine</dt><dd>{v.dvla_engine_capacity ? `${v.dvla_engine_capacity} cc` : "—"}</dd></div>
            <div><dt className="text-muted-foreground">CO₂</dt><dd>{v.dvla_co2 ?? "—"}</dd></div>
            <div><dt className="text-muted-foreground">MOT Status</dt><dd>{v.dvla_mot_status ?? "—"}</dd></div>
            <div><dt className="text-muted-foreground">MOT Expiry</dt><dd>{v.dvla_mot_expiry_date ?? "—"}</dd></div>
          </dl>
        </div>

        <aside className="rounded-lg border p-4">
          <h2 className="font-semibold mb-2">Actions</h2>
          <div className="space-y-2 text-sm">
            <a href="/contact" className="underline">Book a viewing</a><br />
            <a href="/contact" className="underline">Get a quote</a>
          </div>
        </aside>
      </section>
    </main>
  )
}
