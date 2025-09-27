export default function Hero() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 grid gap-8 md:grid-cols-2 items-center">
        <div className="space-y-4">
          <h1 className="text-4xl/tight md:text-5xl font-bold">
            Shiftbox Automotive — Sales, Servicing & Detailing
          </h1>
          <p className="text-muted-foreground">
            Independent garage near Kendal. Straightforward cars, transparent work, pro detailing.
          </p>
          <div className="flex gap-3">
            <a href="/vehicles" className="btn btn-primary">Browse Vehicles</a>
            <a href="/contact" className="btn btn-outline">Book a Service</a>
          </div>
        </div>
        <div className="rounded-2xl overflow-hidden border">
          {/* Replace with your hero image/carousel later */}
          <img alt="Shiftbox workshop" src="/placeholder.svg?height=500&width=800" className="w-full h-auto" />
        </div>
      </div>
    </section>
  )
}
