export default function FooterCta() {
  return (
    <section className="py-12 border-t">
      <div className="container mx-auto px-4 text-center space-y-3">
        <h3 className="text-xl font-semibold">Ready to visit or book?</h3>
        <div className="flex gap-3 justify-center">
          <a href="/vehicles" className="btn btn-primary">Browse Vehicles</a>
          <a href="/contact" className="btn btn-outline">Get in Touch</a>
        </div>
      </div>
    </section>
  )
}
