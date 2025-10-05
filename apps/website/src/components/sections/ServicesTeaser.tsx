const items = [
  { href: "/services/servicing", title: "Servicing & Repairs", desc: "Routine service, diagnostics, MOT prep." },
  { href: "/services/detailing", title: "Professional Detailing", desc: "Decontam, correction, protection." },
]

export default function ServicesTeaser() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Our Services</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((s) => (
            <a key={s.href} href={s.href} className="rounded-xl border p-6 hover:bg-muted/50 transition">
              <div className="text-lg font-medium">{s.title}</div>
              <div className="text-sm text-muted-foreground">{s.desc}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
