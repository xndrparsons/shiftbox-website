// server component
import Link from "next/link"

export default async function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        <Link href="/" className="font-semibold tracking-tight text-lg">
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: "linear-gradient(135deg, oklch(0.6801 0.1583 276.9349), oklch(0.7845 0.1325 181.9120))" }}
          >
            Shiftbox
          </span>
        </Link>
        <nav className="hidden gap-6 md:flex text-sm text-muted-foreground">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <Link href="/vehicles" className="hover:text-foreground">Vehicles</Link>
          <Link href="/services" className="hover:text-foreground">Services</Link>
          <Link href="/portfolio" className="hover:text-foreground">Portfolio</Link>
          <Link href="/blog" className="hover:text-foreground">Blog</Link>
          <Link href="/contact" className="hover:text-foreground">Contact</Link>
        </nav>
      </div>
    </header>
  )
}
