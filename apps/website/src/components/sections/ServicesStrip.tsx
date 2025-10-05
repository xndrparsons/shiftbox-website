export default function ServicesStrip() {
  const cards = [
    {
      title: "Quality Used Cars",
      points: ["HPI Checked", "Full Service History", "Warranty Included", "Finance Available"],
      icon: "🚗",
    },
    {
      title: "Professional Servicing",
      points: ["MOT Testing", "Diagnostic Services", "Brake & Clutch", "Engine Repairs"],
      icon: "🔧",
    },
    {
      title: "Premium Detailing",
      points: ["Paint Correction", "Ceramic Coating", "Interior Deep Clean", "Paint Protection"],
      icon: "✨",
    },
  ]
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="font-heading text-3xl md:text-4xl">Our Services</h2>
        <p className="mt-2 text-foreground/70">Comprehensive automotive solutions for every need</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(c => (
          <div key={c.title} className="rounded-xl border border-border/60 bg-background/60 p-6">
            <div className="text-3xl mb-4 opacity-80">{c.icon}</div>
            <h3 className="text-xl font-medium">{c.title}</h3>
            <ul className="mt-4 space-y-2 text-sm text-foreground/80">
              {c.points.map(p => <li key={p} className="flex gap-2"><span>✔</span><span>{p}</span></li>)}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}
