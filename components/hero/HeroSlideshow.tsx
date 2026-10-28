'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Sparkles } from 'lucide-react';

interface Slide {
  id: number;
  url: string;
  title: string;
  location: string;
  price: string;
  type: string;
}

const SLIDES: Slide[] = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=70&w=1400&auto=format&fit=crop',
    title: 'The Bel-Air Crown Promontory',
    location: 'Bel-Air, Los Angeles, CA',
    price: '$24,500,000',
    type: 'Modern Architectural Villa',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2000&auto=format&fit=crop',
    title: 'Villa Solaria Maritime',
    location: "Cap d'Antibes, Côte d'Azur, France",
    price: '€18,200,000',
    type: 'Waterfront Cliffside Sanctuary',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=2000&auto=format&fit=crop',
    title: 'Palazzo di Vista Lago',
    location: 'Bellagio, Lake Como, Italy',
    price: '€14,800,000',
    type: 'Historic Lakeside Estate',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop',
    title: 'The Grosvenor Duplex Penthouse',
    location: 'Mayfair, Central London, UK',
    price: '£16,500,000',
    type: 'Skyline Terrace Penthouse',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2000&auto=format&fit=crop',
    title: 'The Alpine Ridge Retreat',
    location: 'Red Mountain, Aspen, CO',
    price: '$19,750,000',
    type: 'Alpine Masterpiece',
  },
];

const AUTOPLAY_INTERVAL = 6000;

interface HeroSlideshowProps {
  children?: React.ReactNode;
}

export function HeroSlideshow({ children }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const currentSlide = SLIDES[currentIndex];

  return (
    <div className="relative min-h-[680px] lg:min-h-[760px] flex items-center justify-center overflow-hidden bg-zinc-950 px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
      {/* Background Slideshow with AnimatePresence */}
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            className="absolute inset-0"
          >
              <Image
              src={currentSlide.url}
              alt={currentSlide.title}
              fill
              priority={currentIndex === 0}
              unoptimized
              sizes="100vw"
              referrerPolicy="no-referrer"
              className="object-cover filter brightness-[0.60]"
            />
          </motion.div>
        </AnimatePresence>

        {/* Cinematic Vignette & Gradients */}
<div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950/70 via-zinc-900/30 to-transparent backdrop-blur-[1px]" />
        <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_0%,rgba(9,9,11,0.55)_100%] pointer-events-none" />
      </div>

      {/* Floating Property Showcase Badge (Bottom Left) */}
      

      {/* Main Hero Content (Headline, Search, Details) */}
      <div className="relative z-10 mx-auto max-w-5xl text-center w-full">{children}</div>
    </div>
  );
}
