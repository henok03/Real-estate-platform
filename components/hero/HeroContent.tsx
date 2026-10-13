'use client';

import { motion } from 'motion/react';
import { Sparkles, ShieldCheck, Award, Building2 } from 'lucide-react';
import { PropertySearchFilter } from '@/components/property/PropertySearchFilter';

export function HeroContent() {
  return (
    <div className="mx-auto max-w-5xl text-center">
      {/* Top pill badge with gentle floating animation */}
      <motion.div
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300 backdrop-blur-md mb-6 shadow-lg shadow-amber-500/10"
      >
        <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
        <span>Bespoke Global Real Estate Portfolio</span>
      </motion.div>

      {/* Main Headline with staggered text reveal */}
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]"
      >
        Extraordinary Residences <br />
        <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-100 bg-clip-text text-transparent">
          Curated for the Discerning
        </span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-300 leading-relaxed font-light"
      >
        Connecting distinguished collectors and private investors with prime architectural sanctuaries,
        waterfront villas, and prestigious urban penthouses across premier markets.
      </motion.p>

      {/* Animated Search Box */}
      <motion.div
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="mt-10 sm:mt-12 text-left"
      >
        <PropertySearchFilter compact />
      </motion.div>

      {/* Quick Metrics Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-zinc-400"
      >
        
        <div className="flex items-center gap-2 hover:text-amber-400 transition-colors">
          <Award className="h-4 w-4 text-amber-400" />
          <span>Zero Fake Listings Policy</span>
        </div>
        <div className="flex items-center gap-2 hover:text-amber-400 transition-colors">
          <Building2 className="h-4 w-4 text-amber-400" />
          <span>Private Client Advisory</span>
        </div>
      </motion.div>
    </div>
  );
}
