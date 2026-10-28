
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
} from 'lucide-react';
import Image from 'next/image';

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-zinc-950 text-zinc-300">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16">
        <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:gap-x-8 sm:gap-y-10 lg:grid-cols-4 lg:gap-12">

          {/* Brand Information */}
          <div className="col-span-2 space-y-4 text-center lg:col-span-1 lg:text-left">
            <Link
              href="/"
              className="flex items-center justify-center gap-3 lg:justify-start"
            >
              <Image
                src="/images/logo.png"
                alt="Aura Estates logo"
                width={64}
                height={64}
                className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
              />

              <span className="font-serif text-xl font-bold tracking-tight text-white">
                Aura <span className="text-amber-500">Estates</span>
              </span>
            </Link>

            <p className="mx-auto max-w-sm text-sm leading-relaxed text-zinc-400 lg:mx-0">
              Discover houses, apartments, villas, land, and
              commercial properties in Ethiopia. Find the right
              property for your home, business, or investment.
            </p>
          </div>

          {/* Quick Navigation */}
          <div className="min-w-0 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wide text-white">
              Quick Navigation
            </h4>

            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="transition-colors hover:text-amber-400">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/properties" className="transition-colors hover:text-amber-400">
                  All Properties
                </Link>
              </li>
              <li>
                <Link href="/about" className="transition-colors hover:text-amber-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-amber-400">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Property Types */}
          <div className="min-w-0 space-y-5">
            <h4 className="text-xs font-bold uppercase tracking-wide text-white">
              Property Types
            </h4>

            <ul className="space-y-3 text-sm text-zinc-400">
              <li>
                <Link
                  href="/properties?property_type=house"
                  className="break-words transition-colors hover:text-amber-400"
                >
                  Houses
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?property_type=villa"
                  className="break-words transition-colors hover:text-amber-400"
                >
                  Villas
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?property_type=apartment"
                  className="break-words transition-colors hover:text-amber-400"
                >
                  Apartments
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?property_type=land"
                  className="break-words transition-colors hover:text-amber-400"
                >
                  Land
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?property_type=shop"
                  className="break-words transition-colors hover:text-amber-400"
                >
                  Shops
                </Link>
              </li>
              <li>
                <Link
                  href="/properties?property_type=commercial_building"
                  className="break-words transition-colors hover:text-amber-400"
                >
                  Commercial Buildings
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className="col-span-2 min-w-0 space-y-5 lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-wide text-white">
              Contact Information
            </h4>

            <ul className="space-y-4 text-sm text-zinc-400">
              <li className="flex items-start gap-3">
                <MapPin className="mt-1 h-4 w-4 shrink-0 text-amber-500" />
                <span className="min-w-0 break-words leading-relaxed">
                  Addis Ababa, Ethiopia
                  <span className="mt-1 block text-xs text-zinc-500">
                    Replace with your actual office address
                  </span>
                </span>
              </li>

              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <a
                  href="tel:+251911000000"
                  className="min-w-0 break-words transition-colors hover:text-amber-400"
                >
                  +251 91 100 0000
                </a>
              </li>

              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-amber-500" />
                <a
                  href="mailto:info@auraestates.com"
                  className="min-w-0 break-all transition-colors hover:text-amber-400"
                >
                  info@auraestates.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-9 flex flex-col items-center gap-5 border-t border-zinc-800 pt-6 text-xs text-zinc-400 sm:mt-12 sm:pt-8 md:flex-row md:justify-between">
          <p className="text-center leading-relaxed md:text-left">
            © {new Date().getFullYear()} Aura Estates. All rights reserved.
          </p>

          <div className="flex flex-row flex-wrap items-center justify-center gap-x-4 gap-y-3 sm:gap-x-6">
            <Link
              href="/contact"
              className="transition-colors hover:text-amber-400"
            >
              Privacy Policy
            </Link>

            <Link
              href="/contact"
              className="transition-colors hover:text-amber-400"
            >
              Terms &amp; Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}