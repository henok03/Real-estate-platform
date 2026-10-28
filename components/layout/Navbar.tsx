'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Building2, Menu, X, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
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
<Link
  href="/"
  className="group flex shrink-0 items-center gap-3 sm:gap-4"
>
  <div className="relative flex shrink-0 items-center justify-center">
    <Image
      src="/images/logo.png"
      alt="Aura Estates"
      width={40}
      height={40}
      priority
      sizes="(max-width: 600px) 44px, 44px"
      className="h-14 w-14 max-w-[46px] object-contain transition-all duration-300 group-hover:scale-105 group-hover:drop-shadow-[0_0_8px_rgba(217,119,6,0.35)] sm:h-[72px] sm:max-w-[100px]"
    />
  </div>

  <div className="min-w-0">
    <span className="block whitespace-nowrap font-serif text-base font-bold leading-tight tracking-tight text-zinc-950 sm:text-xl md:text-2xl lg:text-3xl">
      Aura <span className="text-amber-600">Estates</span>
    </span>

    <span className="mt-1 block whitespace-nowrap text-[8px] font-semibold uppercase leading-none tracking-[0.16em] text-zinc-500 sm:text-[10px] sm:tracking-[0.2em]">
     Where Luxury Lives
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
