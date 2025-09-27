const points = [
  { title: "Balanced services", desc: "Sales, servicing, detailing — one roof." },
  { title: "Honest diagnostics", desc: "MOT-aligned health reports, clear quotes." },
  { title: "Rural smallholding", desc: "Low overheads, fair pricing, flexible." },
  { title: "Data-backed", desc: "DVLA & MOT history in your report." },
]

export default function WhyShiftbox() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-semibold mb-6">Why Choose Shiftbox</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {points.map((p) => (
            <div key={p.title} className="rounded-xl border p-4">
              <div className="font-medium">{p.title}</div>
              <div className="text-sm text-muted-foreground">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
