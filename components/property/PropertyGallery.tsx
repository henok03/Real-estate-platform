'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Maximize2, X, Image as ImageIcon } from 'lucide-react';
import type { PropertyImage } from '@/types';

interface PropertyGalleryProps {
  images?: PropertyImage[];
  title: string;
}

export function PropertyGallery({ images = [], title }: PropertyGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Sort images: primary first, then sort_order
  const sortedImages = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order || 0) - (b.sort_order || 0);
  });

  if (sortedImages.length === 0) {
    return (
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-100 flex flex-col items-center justify-center border border-zinc-200 text-zinc-400">
        <ImageIcon className="h-16 w-16 stroke-1 text-zinc-300 mb-2" />
        <p className="text-sm font-medium text-zinc-500">Photography pending for this property</p>
      </div>
    );
  }

  const currentImage = sortedImages[selectedIndex] || sortedImages[0];

  const handlePrev = () => {
    setSelectedIndex((prev) => (prev === 0 ? sortedImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setSelectedIndex((prev) => (prev === sortedImages.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="space-y-4">
      {/* Main Large Image */}
      <div className="group relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl bg-zinc-950 shadow-md">
        <Image
          src={currentImage.image_url}
          alt={`${title} - view ${selectedIndex + 1}`}
          fill
          priority
          referrerPolicy="no-referrer"
          className="object-cover transition-all duration-300"
        />

        {/* Floating Controls */}
        {sortedImages.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              type="button"
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-zinc-900 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={handleNext}
              type="button"
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2.5 text-zinc-900 shadow-md backdrop-blur-sm transition-all hover:bg-white hover:scale-105 active:scale-95"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}

        {/* Counter and Fullscreen trigger */}
        <div className="absolute bottom-4 right-4 flex items-center gap-2">
          <span className="rounded-lg bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            {selectedIndex + 1} / {sortedImages.length}
          </span>
          <button
            type="button"
            onClick={() => setLightboxOpen(true)}
            className="rounded-lg bg-black/60 p-1.5 text-white backdrop-blur-sm hover:bg-black/80 transition-colors"
            aria-label="Open fullscreen"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Thumbnails Row */}
      {sortedImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {sortedImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setSelectedIndex(idx)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                selectedIndex === idx
                  ? 'border-amber-600 ring-2 ring-amber-600/30 shadow'
                  : 'border-transparent opacity-70 hover:opacity-100'
              }`}
            >
              <Image
                src={img.image_url}
                alt={`Thumbnail ${idx + 1}`}
                fill
                referrerPolicy="no-referrer"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm">
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            className="absolute top-6 right-6 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          <div className="relative h-[80vh] w-[90vw] max-w-5xl">
            <Image
              src={currentImage.image_url}
              alt={`${title} - fullscreen`}
              fill
              referrerPolicy="no-referrer"
              className="object-contain"
            />
          </div>

          {sortedImages.length > 1 && (
            <>
              <button
                onClick={handlePrev}
                type="button"
                className="absolute left-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={handleNext}
                type="button"
                className="absolute right-6 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-3 text-white hover:bg-white/30"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
