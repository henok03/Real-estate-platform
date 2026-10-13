'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/properties', label: 'Properties' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const isAdmin = pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200/80 bg-white/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-18 sm:h-20 max-w-7xl items-center justify-between px-3 sm:px-6 lg:px-8">
        {/* Responsive Logo & Brand */}
        <Link href="/" className="group flex items-center gap-2.5 sm:gap-3 shrink-0">
          <div className="flex h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11 shrink-0 items-center justify-center rounded-xl bg-zinc-900 text-amber-500 shadow-md transition-transform duration-200 group-hover:scale-105">
            <Building2 className="h-5 w-5 sm:h-5.5 sm:w-5.5 lg:h-6 lg:w-6 stroke-[2.2]" />
          </div>
          <div className="min-w-0">
            <span className="font-serif text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight text-zinc-950 whitespace-nowrap block leading-tight">
              Aura <span className="text-amber-600">Estates</span>
            </span>
            <span className="block text-[8px] sm:text-[9px] lg:text-[10px] uppercase tracking-widest text-zinc-500 font-semibold truncate leading-none mt-0.5">
              Signature Residences
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links (Visible on large screens 1024px+) */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-3.5 py-2 text-sm font-medium transition-colors rounded-lg ${
                  active
                    ? 'text-zinc-950 font-semibold'
                    : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/60'
                }`}
              >
                {link.label}
                {active && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-3 right-3 h-0.5 bg-amber-600 rounded-full"
                    transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Action & Admin Area Access on Large Screens */}
        <div className="hidden lg:flex items-center gap-2.5">
          <Link href="/admin">
            <Button
              variant="outline"
              size="sm"
              className="gap-2 border-zinc-200 text-zinc-700 hover:border-zinc-300 hover:text-zinc-900"
            >
              <ShieldCheck className="h-4 w-4 text-amber-600" />
              <span>{isAdmin ? 'Dashboard' : 'Portal'}</span>
            </Button>
          </Link>
          <Link href="/properties">
            <Button className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm gap-1.5 px-4 text-xs font-semibold">
              <span>Explore Listings</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>

        {/* Tablet & Mobile Controls (Under 1024px) */}
        <div className="flex lg:hidden items-center gap-1.5 sm:gap-2">
          {/* Quick link button on tablet */}
          <Link href="/properties" className="hidden sm:inline-flex">
            <Button
              size="sm"
              variant="outline"
              className="h-8.5 px-3 text-xs border-zinc-200 text-zinc-800 font-medium"
            >
              <span>Listings</span>
            </Button>
          </Link>

          <Link href="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 text-zinc-700 hover:bg-zinc-100"
              title="Admin Portal"
            >
              <ShieldCheck className="h-4.5 w-4.5 text-amber-600" />
            </Button>
          </Link>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-700 hover:bg-zinc-100 active:scale-95 transition-all"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Responsive Tablet & Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-b border-zinc-200 bg-white/98 backdrop-blur-xl lg:hidden shadow-lg"
          >
            <div className="space-y-1.5 px-4 sm:px-6 pt-3 pb-6 max-w-2xl mx-auto">
              {navLinks.map((link) => {
                const active = isActive(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block rounded-xl px-4 py-3 text-base font-medium transition-colors ${
                      active
                        ? 'bg-amber-50 text-amber-900 font-semibold border border-amber-200/50'
                        : 'text-zinc-700 hover:bg-zinc-100'
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <div className="pt-4 border-t border-zinc-100 flex flex-col sm:flex-row gap-2.5">
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-50 transition-colors"
                >
                  <ShieldCheck className="h-4 w-4 text-amber-600" />
                  <span>Admin Dashboard Portal</span>
                </Link>
                <Link
                  href="/properties"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-zinc-800 transition-colors"
                >
                  <span>Explore Properties</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
