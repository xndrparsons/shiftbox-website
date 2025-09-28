"use client"

import Link from "next/link"
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background/60">
      <div className="container mx-auto px-4 py-12">
        {/* Top grid */}
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand blurb */}
          <div>
            <div className="flex items-center gap-2 text-xl font-heading">
              <span className="text-foreground/70">🚗</span>
              <span className="logo-text font-logo select-none tracking-wide">Shiftbox</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Quality used cars, professional servicing, and expert detailing in Kendal, Cumbria.
            </p>

            <div className="mt-5 flex items-center gap-4 text-muted-foreground">
              <Link href="https://facebook.com" target="_blank" className="hover:text-foreground transition">
                <Facebook size={18} />
              </Link>
              <Link href="https://instagram.com" target="_blank" className="hover:text-foreground transition">
                <Instagram size={18} />
              </Link>
              <Link href="https://twitter.com" target="_blank" className="hover:text-foreground transition">
                <Twitter size={18} />
              </Link>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-base font-heading">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link href="/vehicles" className="hover:underline">Browse Vehicles</Link></li>
              <li><Link href="/services" className="hover:underline">Vehicle Servicing</Link></li>
              <li><Link href="/services/detailing" className="hover:underline">Car Detailing</Link></li>
              <li><Link href="/portfolio" className="hover:underline">Our Work</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-base font-heading">Contact Us</h3>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2"><Phone size={16} /> <span>01539 123456</span></li>
              <li className="flex items-center gap-2"><Mail size={16} /> <span>info@shiftbox.co.uk</span></li>
              <li className="flex items-center gap-2"><MapPin size={16} /> <span>Kendal, Cumbria</span></li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 h-px bg-border" />

        {/* Bottom bar */}
        <div className="mt-6 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Shiftbox. All rights reserved. | Professional automotive services in Cumbria.
        </div>
      </div>
    </footer>
  )
}
