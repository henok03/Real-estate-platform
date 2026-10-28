
'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Star,
  Quote,
} from 'lucide-react';
import { AnimateIn, MotionCard } from '@/components/ui/animate-in';
import { Button } from '@/components/ui/button';
import type { Testimonial } from '@/types';

interface PublicTestimonialsSliderProps {
  testimonials: Testimonial[];
}

export function PublicTestimonialsSlider({
  testimonials,
}: PublicTestimonialsSliderProps) {
  const [currentPage, setCurrentPage] = useState(0);

  // Display three testimonials in each slide.
  const pageSize = 3;
  const totalPages = Math.ceil(testimonials.length / pageSize);

  useEffect(() => {
    if (totalPages <= 1) return;

    const timer = window.setInterval(() => {
      setCurrentPage((page) => (page + 1) % totalPages);
    }, 5000);

    return () => window.clearInterval(timer);
  }, [totalPages]);

  // Keep the page index valid if testimonials change.
  const safePage =
    totalPages > 0 ? Math.min(currentPage, totalPages - 1) : 0;

  const visibleTestimonials = testimonials.slice(
    safePage * pageSize,
    safePage * pageSize + pageSize,
  );

  function previousSlide() {
    setCurrentPage((page) =>
      page === 0 ? totalPages - 1 : page - 1,
    );
  }

  function nextSlide() {
    setCurrentPage((page) => (page + 1) % totalPages);
  }

  return (
    <section
      className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      aria-label="Client testimonials"
    >
      <AnimateIn direction="up" className="mx-auto mb-12 max-w-2xl text-center">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
          Verified Client Experiences
        </span>

        <h2 className="mt-2 font-serif text-3xl font-bold text-zinc-950 sm:text-4xl">
          Client Commendations
        </h2>

        <p className="mt-2 text-sm text-zinc-600">
          Discover what our clients say about their real estate experience.
        </p>
      </AnimateIn>

      {testimonials.length > 0 ? (
        <>
          <div
            className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3"
            aria-live="polite"
          >
            {visibleTestimonials.map((testimonial, index) => (
              <AnimateIn
                key={testimonial.id}
                delay={index * 0.1}
                direction="up"
              >
                <MotionCard className="flex h-full min-h-64 flex-col justify-between rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md">
                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <Quote className="h-8 w-8 text-amber-500" />

                      <div
                        className="flex gap-1"
                        aria-label={`${testimonial.rating ?? 5} out of 5 stars`}
                      >
                        {Array.from({
                          length: Math.max(
                            0,
                            Math.min(5, testimonial.rating ?? 5),
                          ),
                        }).map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className="h-4 w-4 fill-amber-500 text-amber-500"
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm italic leading-7 text-zinc-700">
                      &ldquo;{testimonial.content}&rdquo;
                    </p>
                  </div>

                  <div className="mt-6 border-t border-zinc-100 pt-4">
                    <p className="font-serif text-sm font-bold text-zinc-950">
                      {testimonial.client_name}
                    </p>

                    {testimonial.client_title && (
                      <p className="mt-1 text-xs text-zinc-500">
                        {testimonial.client_title}
                      </p>
                    )}
                  </div>
                </MotionCard>
              </AnimateIn>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-5">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={previousSlide}
                aria-label="Previous testimonials"
                className="rounded-full border-zinc-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setCurrentPage(index)}
                    aria-label={`Go to testimonial slide ${index + 1}`}
                    aria-current={safePage === index ? 'true' : undefined}
                    className={`h-2.5 rounded-full transition-all ${
                      safePage === index
                        ? 'w-7 bg-amber-500'
                        : 'w-2.5 bg-zinc-300 hover:bg-zinc-400'
                    }`}
                  />
                ))}
              </div>

              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={nextSlide}
                aria-label="Next testimonials"
                className="rounded-full border-zinc-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}

        </>
      ) : (
        <div className="mx-auto max-w-xl rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm">
          <p className="font-serif font-medium text-zinc-700">
            No published client reviews yet.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Published testimonials will appear here when they are available.
          </p>
        </div>
      )}
    </section>
  );
}
