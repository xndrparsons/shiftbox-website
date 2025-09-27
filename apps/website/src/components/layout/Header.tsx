import Logo from "@/components/brand/Logo"

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Logo size="lg" />
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a href="/vehicles" className="hover:text-foreground">Vehicles</a>
          <a href="/services" className="hover:text-foreground">Services</a>
          <a href="/portfolio" className="hover:text-foreground">Portfolio</a>
          <a href="/contact" className="hover:text-foreground">Contact</a>
        </nav>
      </div>
    </header>
  )
}
