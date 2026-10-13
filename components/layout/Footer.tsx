import Link from 'next/link';
import { Building2, Mail, Phone, MapPin, ArrowUpRight } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand info */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-zinc-950 shadow">
                <Building2 className="h-5 w-5 stroke-[2.2] text-amber-600" />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Aura <span className="text-amber-500">Estates</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-400">
              Curating prime residential sanctuaries, luxury penthouses, and bespoke architectural estates
              crafted for distinguished lifestyles.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-zinc-900 border border-zinc-800 px-3 py-1 text-xs text-amber-400 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Neon PostgreSQL Verified
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Quick Navigation</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/" className="hover:text-amber-400 transition-colors">
                  Home Overview
                </Link>
              </li>
              <li>
                <Link href="/properties" className="hover:text-amber-400 transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-amber-400 transition-colors">
                  About Our Heritage
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-400 transition-colors">
                  Inquiries & Contact
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-amber-400 transition-colors inline-flex items-center gap-1">
                  Admin Portal <ArrowUpRight className="h-3 w-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Property Types</h4>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              <li>
                <Link href="/properties?property_type=villa" className="hover:text-amber-400 transition-colors">
                  Private Villas
                </Link>
              </li>
              <li>
                <Link href="/properties?property_type=condo" className="hover:text-amber-400 transition-colors">
                  Luxury Condominiums
                </Link>
              </li>
              <li>
                <Link href="/properties?property_type=apartment" className="hover:text-amber-400 transition-colors">
                  Penthouse Apartments
                </Link>
              </li>
              <li>
                <Link href="/properties?property_type=single_family" className="hover:text-amber-400 transition-colors">
                  Single-Family Residences
                </Link>
              </li>
              <li>
                <Link href="/properties?property_type=commercial" className="hover:text-amber-400 transition-colors">
                  Commercial & Office
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">Private Office</h4>
            <ul className="space-y-3 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="h-4 w-4 shrink-0 text-amber-500 mt-1" />
                <span>450 Park Avenue, Suite 2800, New York, NY 10022</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-amber-500" />
                <span>+1 (800) 555-AURA (2872)</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-amber-500" />
                <span>concierge@auraestates.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 border-t border-zinc-900 pt-8 flex flex-col items-center justify-between gap-4 text-xs text-zinc-300 md:flex-row">
          <p>© {new Date().getFullYear()} Aura Estates International Realty. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="hover:text-zinc-200">
              Admin Login
            </Link>
            <Link href="/contact" className="hover:text-zinc-200">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-zinc-200">
              Terms of Representation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
