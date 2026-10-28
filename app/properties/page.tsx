import Link from 'next/link';
import { Building2, SearchX, PlusCircle, ArrowLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyCard } from '@/components/property/PropertyCard';
import { PropertySearchFilter } from '@/components/property/PropertySearchFilter';
import { AnimateIn } from '@/components/ui/animate-in';
import { Button } from '@/components/ui/button';
import { getProperties } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PropertiesPageProps {
  searchParams: Promise<{
    location?: string;
    property_type?: string;
    min_price?: string;
    max_price?: string;
    bedrooms?: string;
    bathrooms?: string;
    status?: string;
  }>;
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  const resolvedParams = await searchParams;

  const minPrice = resolvedParams.min_price ? parseFloat(resolvedParams.min_price) : undefined;
  const maxPrice = resolvedParams.max_price ? parseFloat(resolvedParams.max_price) : undefined;
  const bedrooms = resolvedParams.bedrooms ? parseInt(resolvedParams.bedrooms, 10) : undefined;
  const bathrooms = resolvedParams.bathrooms ? parseFloat(resolvedParams.bathrooms) : undefined;

  // Query database for published properties matching criteria
  const properties = await getProperties({
    status: 'published',
    location: resolvedParams.location,
    property_type: resolvedParams.property_type,
    min_price: isNaN(minPrice as number) ? undefined : minPrice,
    max_price: isNaN(maxPrice as number) ? undefined : maxPrice,
    bedrooms: isNaN(bedrooms as number) ? undefined : bedrooms,
    bathrooms: isNaN(bathrooms as number) ? undefined : bathrooms,
  });

  const hasActiveFilters = Boolean(
    resolvedParams.location ||
      resolvedParams.property_type ||
      resolvedParams.min_price ||
      resolvedParams.max_price ||
      resolvedParams.bedrooms ||
      resolvedParams.bathrooms
  );

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* Page Header */}
        <section className="border-b border-zinc-200 bg-white py-12 sm:py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <AnimateIn direction="up">
              <div className="max-w-2xl">
                
                <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-zinc-950 mt-2">
                  Available Residences
                </h1>
                <p className="mt-3 text-base text-zinc-600 leading-relaxed">
                  Explore authenticated estates, luxury villas, and bespoke penthouse residences.
                 
                </p>
              </div>
            </AnimateIn>
          </div>
        </section>

        {/* Filters and Results Section */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Search/Filter Bar */}
          <AnimateIn direction="up" delay={0.1} className="mb-8">
            <PropertySearchFilter />
          </AnimateIn>

          {/* Results count & status */}
          <AnimateIn direction="none" delay={0.15}>
            <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-zinc-500 border-b border-zinc-200/80 pb-4">
              <div>
                Showing <span className="font-bold text-zinc-900">{properties.length}</span>{' '}
                {properties.length === 1 ? 'residence' : 'residences'} matching criteria
              </div>

              
            </div>
          </AnimateIn>

          {/* Listing Grid or Empty States */}
          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {properties.map((property, idx) => (
                <AnimateIn key={property.id} delay={idx * 0.08} direction="up">
                  <PropertyCard property={property} priority={idx < 6} />
                </AnimateIn>
              ))}
            </div>
          ) : (
            <AnimateIn direction="up" delay={0.2}>
              <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-zinc-100 text-zinc-400 mb-4">
                  {hasActiveFilters ? (
                    <SearchX className="h-8 w-8 stroke-[1.5]" />
                  ) : (
                    <Building2 className="h-8 w-8 stroke-[1.5]" />
                  )}
                </div>

                <h2 className="font-serif text-xl font-bold text-zinc-900">
                  {hasActiveFilters
                    ? 'No properties match your search.'
                    : 'No properties available yet.'}
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm text-zinc-500 leading-relaxed">
                  {hasActiveFilters
                    ? 'Try broadening your search parameters or removing specific price and bedroom constraints.'
                    : 'There are currently zero properties in the PostgreSQL database. The administrator can create properties using the admin dashboard.'}
                </p>

                <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
                 
                    <Link href="/properties">
                      <Button className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        <span>Reset Filters</span>
                      </Button>
                    </Link>
                  
                </div>
              </div>
            </AnimateIn>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
