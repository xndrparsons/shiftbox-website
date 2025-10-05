import Link from "next/link";
import { LogIn } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-logo tracking-[0.2em] text-sm opacity-80 hover:opacity-100">SHIFTBOX</Link>
        <nav className="flex items-center gap-3">
          <Link href="/vehicles" className="px-3 py-1.5 rounded hover:bg-white/10">Vehicles</Link>
          <Link href="/services" className="px-3 py-1.5 rounded hover:bg-white/10">Services</Link>
          <Link href="/contact" className="px-3 py-1.5 rounded hover:bg-white/10">Contact</Link>
          <Link href="/auth/login" aria-label="Login" className="p-2 rounded hover:bg-white/10">
            <LogIn className="h-5 w-5" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
