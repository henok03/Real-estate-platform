import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, HeartHandshake, Award, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AnimateIn, MotionCard } from '@/components/ui/animate-in';
import { Button } from '@/components/ui/button';

export const metadata = {
  title: 'About Our Heritage | Aura Estates',
  description:
    'Dedicated to architectural integrity, discretion, and private client representation in premier global real estate markets.',
};

export default function AboutPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-zinc-950 py-24 sm:py-32 text-white">
          <div className="absolute inset-0 z-0">
            <Image
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000&auto=format&fit=crop"
              alt="Architectural interior"
              fill
              priority
              referrerPolicy="no-referrer"
              className="object-cover opacity-25 filter brightness-75 scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-zinc-950/20" />
          </div>

          <div className="relative z-10 mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
            <AnimateIn direction="down">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1 text-xs font-semibold text-amber-300 backdrop-blur-md mb-4 shadow">
                Private Real Estate Advisory
              </span>
            </AnimateIn>

            <AnimateIn direction="up" delay={0.1}>
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                An Enduring Commitment to <br />
                <span className="text-amber-400">Architectural Distinction</span>
              </h1>
            </AnimateIn>

            <AnimateIn direction="up" delay={0.2}>
              <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-zinc-300 font-light leading-relaxed">
  At Aura Estates, we connect people with exceptional homes, modern apartments, and commercial properties. Through trusted service and
  a commitment to quality, we make finding the right property simple, transparent, and rewarding.
</p>
            </AnimateIn>
          </div>
        </section>

        {/* Mission Section */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimateIn direction="right">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Our Guiding Mission
              </span>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950 mt-2">
                Elevating Real Estate into an Art of Stewardship
              </h2>
              <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-600">
                At Aura Estates, we believe that an exceptional residence is far more than physical square footage;
                it is an expression of human achievement, cultural legacy, and personal sanctuary.
              </p>
          <p className="mt-4 text-sm sm:text-base leading-relaxed text-zinc-600">
  Our mission is to provide exceptional properties that combine quality,
  comfort, and lasting value. As property owners, we are committed to
  offering outstanding spaces and a transparent, reliable experience
  for every customer.
</p>

              <div className="mt-8 grid grid-cols-2 gap-4 border-t border-zinc-200 pt-6">
                <div>
                  <span className="block font-serif text-2xl font-bold text-zinc-950">100%</span>
                  <span className="text-xs text-zinc-500">Verified Database Listings</span>
                </div>
                <div>
                  <span className="block font-serif text-2xl font-bold text-zinc-950">Strict</span>
                  <span className="text-xs text-zinc-500">Confidentiality Guarantee</span>
                </div>
              </div>
            </AnimateIn>

            <AnimateIn direction="left" delay={0.15}>
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-zinc-200">
                <Image
                  src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1600&auto=format&fit=crop"
                  alt="Estate architecture"
                  fill
                  referrerPolicy="no-referrer"
                  className="object-cover hover:scale-105 transition-transform duration-700"
                />
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Core Values Section */}
     <section className="border-y border-zinc-200 bg-white py-20">
  <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
    <AnimateIn direction="up" className="text-center max-w-2xl mx-auto mb-16">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
        Foundations of Aura Estates
      </span>

      <h2 className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950 mt-2">
        Our Core Values
      </h2>

      <p className="mt-3 text-sm text-zinc-600">
        We are committed to quality properties, honest service, and creating
        lasting value for every customer.
      </p>
    </AnimateIn>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <AnimateIn delay={0.08} direction="up">
        <MotionCard className="h-full rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-8 transition-all hover:border-amber-400 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-amber-500 mb-6">
            <ShieldCheck className="h-6 w-6" />
          </div>

          <h3 className="font-serif text-xl font-bold text-zinc-900">
            Quality & Integrity
          </h3>

          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            We maintain high standards across our properties, providing
            honest information, clear communication, and a reliable experience.
          </p>
        </MotionCard>
      </AnimateIn>

      <AnimateIn delay={0.16} direction="up">
        <MotionCard className="h-full rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-8 transition-all hover:border-amber-400 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-amber-500 mb-6">
            <Award className="h-6 w-6" />
          </div>

          <h3 className="font-serif text-xl font-bold text-zinc-900">
            Exceptional Properties
          </h3>

          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            We focus on quality design, comfortable spaces, and thoughtful
            details that make every property a place to be proud of.
          </p>
        </MotionCard>
      </AnimateIn>

      <AnimateIn delay={0.24} direction="up">
        <MotionCard className="h-full rounded-2xl border border-zinc-200/80 bg-zinc-50/50 p-8 transition-all hover:border-amber-400 hover:shadow-lg">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-amber-500 mb-6">
            <HeartHandshake className="h-6 w-6" />
          </div>

          <h3 className="font-serif text-xl font-bold text-zinc-900">
            Customer Commitment
          </h3>

          <p className="mt-3 text-sm text-zinc-600 leading-relaxed">
            We put our customers first by providing responsive support,
            transparent communication, and dependable service throughout
            their property journey.
          </p>
        </MotionCard>
      </AnimateIn>
    </div>
  </div>
</section>

        {/* Founder Message Section */}
       <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
  <AnimateIn direction="up">
    <div className="rounded-3xl border border-zinc-200 bg-white p-8 sm:p-14 shadow-sm">
      <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
        Our Commitment
      </span>

      <h2 className="font-serif text-2xl sm:text-3xl font-bold text-zinc-950 mt-2 mb-6">
        A Message from Aura Estates
      </h2>

      <div className="space-y-4 text-sm sm:text-base leading-relaxed text-zinc-700 italic border-l-2 border-amber-600 pl-6 my-6">
        <p>
          &ldquo;At Aura Estates, our vision is to provide exceptional
          properties that combine quality, comfort, and lasting value.
          We believe finding the right property should be an exciting
          and straightforward experience.&rdquo;
        </p>

        <p>
          &ldquo;We are committed to maintaining high standards across
          our properties, offering clear information, and treating every
          customer with honesty and respect. Whether you are looking for
          a family home, a modern apartment, or a commercial space, we
          strive to help you find a property that meets your needs.&rdquo;
        </p>

        <p>
          &ldquo;Thank you for considering Aura Estates. We look forward
          to helping you find a place you can truly call your own.&rdquo;
        </p>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 border-t border-zinc-100 pt-6">
        <div>
          <p className="font-serif text-base font-bold text-zinc-900">
            The Aura Estates Team
          </p>
          <p className="text-xs text-zinc-500">
            Quality Properties. Lasting Value.
          </p>
        </div>

        <Link href="/contact">
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow">
            <span>Contact Our Office</span>
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
