export default function WhyShiftbox() {
  const bullets = [
    { title: "Trusted & Transparent", copy: "No hidden fees, honest assessments, and transparent pricing on all our services." },
    { title: "Fast & Reliable", copy: "Quick turnaround times without compromising on quality or attention to detail." },
    { title: "Expert Team", copy: "Experienced professionals passionate about cars and committed to excellence." },
  ]
  return (
    <section className="container mx-auto px-4 py-12 md:py-16">
      <div className="grid gap-8 md:grid-cols-2 items-center">
        <div>
          <h2 className="font-heading text-3xl md:text-4xl mb-6">Why Choose Shiftbox?</h2>
          <ul className="space-y-6">
            {bullets.map(b => (
              <li key={b.title}>
                <div className="text-lg font-medium">{b.title}</div>
                <div className="text-foreground/70">{b.copy}</div>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-border/60 bg-foreground/5 aspect-[16/10]" />
      </div>
    </section>
  )
}
