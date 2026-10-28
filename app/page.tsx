import Link from 'next/link';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  Compass,
  KeyRound,
  FileCheck2,
  Building2,
  Search,
  Star,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/property/PropertyCard';
import { HeroSlideshow } from '@/components/hero/HeroSlideshow';
import { HeroContent } from '@/components/hero/HeroContent';
import { AnimateIn, MotionCard } from '@/components/ui/animate-in';
import { Button } from '@/components/ui/button';
import { getProperties, getPublishedTestimonials } from '@/lib/db';
import { PublicTestimonialsSlider } from '@/components/testimonials/PublicTestimonialsSlider';
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Fetch real published properties from PostgreSQL (limited to 6)
 const [featuredProperties, testimonials] = await Promise.all([
    getProperties({ status: 'published', limit: 6 }),
    getPublishedTestimonials(),
  ]);

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION WITH DYNAMIC SLIDESHOW & ANIMATIONS */}
        <section className="relative">
          <HeroSlideshow>
            <HeroContent />
          </HeroSlideshow>
        </section>

        {/* FEATURED PROPERTIES SECTION WITH SCROLL ANIMATIONS */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <AnimateIn direction="up">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 mb-2">
                  <Building2 className="h-4 w-4" />
                  <span>Curated Selection</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950">
                  Featured Residences
                </h2>
                <p className="mt-2 text-sm text-zinc-600 max-w-xl">
                  A selection of recently authenticated properties directly retrieved from our private portfolio.
                </p>
              </div>

              <Link href="/properties">
                <Button
                  variant="outline"
                  className="gap-2 border-zinc-300 hover:border-zinc-900 hover:bg-zinc-900 hover:text-white"
                >
                  <span>View All Properties</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </AnimateIn>

          {/* Real Database Properties or Empty State */}
          {featuredProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProperties.map((property, idx) => (
                <AnimateIn key={property.id} delay={idx * 0.1} direction="up">
                  <PropertyCard property={property} priority={idx < 3} />
                </AnimateIn>
              ))}
            </div>
          ) : (
            <AnimateIn direction="up" delay={0.1}>
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-amber-700 mb-4">
                  <Building2 className="h-8 w-8 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-xl font-bold text-zinc-900">
                  No properties available yet.
                </h3>
                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 leading-relaxed">
                  Our portfolio is currently awaiting new estate listings. You can log in to the secure Admin
                  Dashboard to manually publish your first verified property.
                </p>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                  <Link href="/admin/properties/new">
                    <Button className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow">
                      <span>Add Property via Admin</span>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/properties">
                    <Button variant="outline" className="border-zinc-200">
                      Browse All Listings
                    </Button>
                  </Link>
                </div>
              </div>
            </AnimateIn>
          )}

          {/* Bottom View All Link */}
          {featuredProperties.length > 0 && (
            <AnimateIn direction="up" delay={0.2} className="mt-12 text-center">
              <Link href="/properties">
                <Button size="lg" className="bg-zinc-900 text-white hover:bg-zinc-800 shadow-md gap-2">
                  <span>Explore Full Portfolio ({featuredProperties.length}+ Properties)</span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </AnimateIn>
          )}
        </section>

        {/* SERVICES SECTION WITH ANIMATED CARDS */}
        <section className="border-y border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateIn direction="up" className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                End-To-End Advisory
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950 mt-2">
                Our Signature Real Estate Services
              </h2>
              <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                Whether acquiring a primary trophy residence, marketing an architecturally significant estate,
                or navigating cross-border portfolio structuring, our private advisors provide unmatched execution.
              </p>
            </AnimateIn>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Service 1 */}
              <AnimateIn delay={0.05} direction="up">
                <MotionCard className="group h-full rounded-2xl border border-zinc-200/80 p-8 transition-all duration-300 hover:border-zinc-950 hover:shadow-xl bg-zinc-50/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                    <KeyRound className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-zinc-900">Property Buying</h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    Confidential representation for buyers seeking off-market acquisitions, private estates, and prime residential assets worldwide.
                  </p>
                </MotionCard>
              </AnimateIn>

              {/* Service 2 */}
              <AnimateIn delay={0.15} direction="up">
                <MotionCard className="group h-full rounded-2xl border border-zinc-200/80 p-8 transition-all duration-300 hover:border-zinc-950 hover:shadow-xl bg-zinc-50/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-zinc-900">Property Selling</h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    Tailored global marketing strategies, editorial photography, architectural storytelling, and targeted outreach to high-net-worth buyers.
                  </p>
                </MotionCard>
              </AnimateIn>

              {/* Service 3 */}
              <AnimateIn delay={0.25} direction="up">
                <MotionCard className="group h-full rounded-2xl border border-zinc-200/80 p-8 transition-all duration-300 hover:border-zinc-950 hover:shadow-xl bg-zinc-50/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                    <FileCheck2 className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-zinc-900">Luxury Rental</h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    Curated leasing portfolios for corporate executives, diplomats, and seasonal international residents desiring turn-key sanctuaries.
                  </p>
                </MotionCard>
              </AnimateIn>

              {/* Service 4 */}
              <AnimateIn delay={0.35} direction="up">
                <MotionCard className="group h-full rounded-2xl border border-zinc-200/80 p-8 transition-all duration-300 hover:border-zinc-950 hover:shadow-xl bg-zinc-50/50">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-amber-500 mb-6 group-hover:scale-110 transition-transform">
                    <Compass className="h-6 w-6" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-zinc-900">Private Consultation</h3>
                  <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
                    Independent portfolio valuations, architectural advisory, zoning analysis, and strategic positioning for discerning asset holders.
                  </p>
                </MotionCard>
              </AnimateIn>
            </div>
          </div>
        </section>

        
<PublicTestimonialsSlider testimonials={testimonials} />

        {/* CTA BANNER WITH ANIMATION */}
        <section className="bg-zinc-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <AnimateIn direction="up">
            <div className="mx-auto max-w-5xl rounded-3xl bg-gradient-to-br from-zinc-950 to-zinc-900 border border-zinc-800 p-8 sm:p-14 text-center shadow-2xl">
              <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
                Ready to Discover Your Next Sanctuary?
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm sm:text-base text-zinc-400">
                Contact our private advisory office or explore our full public catalog of verified properties.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
                <Link href="/properties">
                  <Button size="lg" className="bg-white text-zinc-950 hover:bg-zinc-100 font-semibold gap-2">
                    <Search className="h-4 w-4" />
                    <span>Browse Properties</span>
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="border-zinc-700 text-white hover:bg-zinc-800 gap-2 hover:text-white">
                    <span>Speak With an Advisor</span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </AnimateIn>
        </section>
      </main>

      <Footer />
    </div>
  );
}
