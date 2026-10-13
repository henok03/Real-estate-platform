import { notFound } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Calendar,
  ArrowLeft,
  Navigation,
  CheckCircle2,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PropertyGallery } from '@/components/property/PropertyGallery';
import { PropertyInquiryForm } from '@/components/property/PropertyInquiryForm';
import { AgentCard } from '@/components/property/AgentCard';
import { formatCurrency, formatPropertyType } from '@/components/property/PropertyCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AnimateIn } from '@/components/ui/animate-in';
import { getPropertyById } from '@/lib/db';

export const dynamic = 'force-dynamic';

interface PropertyDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({
  params,
}: PropertyDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  if (!id) return { title: 'Residence Not Found | Aura Estates' };

  const property = await getPropertyById(id);
  if (!property) return { title: 'Residence Not Found | Aura Estates' };

  const location = [property.city, property.state, property.country].filter(Boolean).join(', ');

  return {
    title: `${property.title} | Aura Estates`,
    description:
      property.description?.slice(0, 160) ||
      `Luxury ${formatPropertyType(property.property_type)} located in ${location}. Listed at ${formatCurrency(property.price)}.`,
    openGraph: {
      title: `${property.title} | Aura Estates`,
      description: property.description?.slice(0, 160) || '',
      images: property.primary_image ? [{ url: property.primary_image }] : [],
    },
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { id } = await params;
  if (!id) notFound();

  const property = await getPropertyById(id);
  if (!property) notFound();

  const fullLocation = [property.address, property.city, property.state, property.zip_code, property.country]
    .filter(Boolean)
    .join(', ');

  const hasCoords = property.latitude !== null && property.longitude !== null;

  return (
    <div className="flex min-h-screen flex-col bg-zinc-50">
      <Navbar />

      <main className="flex-1">
        {/* Navigation Breadcrumb */}
        <div className="border-b border-zinc-200 bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8 text-xs text-zinc-500">
            <div className="flex items-center gap-2">
              <Link href="/properties" className="hover:text-zinc-950 flex items-center gap-1 font-medium">
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>All Properties</span>
              </Link>
              <span>/</span>
              <span className="truncate max-w-[200px] sm:max-w-md text-zinc-800 font-semibold">
                {property.title}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link href={`/admin/properties/${property.id}/edit`}>
                <Button variant="ghost" size="sm" className="h-7 text-xs text-zinc-600">
                  Edit as Admin
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Title Header with animation */}
          <AnimateIn direction="up">
            <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <Badge className="bg-zinc-900 text-white font-medium">
                    {formatPropertyType(property.property_type)}
                  </Badge>
                  {property.status === 'draft' && (
                    <Badge variant="warning">Draft Status</Badge>
                  )}
                  {property.status === 'archived' && (
                    <Badge variant="muted">Archived</Badge>
                  )}
                </div>

                <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-zinc-950 tracking-tight">
                  {property.title}
                </h1>

                {fullLocation && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-zinc-600">
                    <MapPin className="h-4 w-4 shrink-0 text-amber-600" />
                    <span>{fullLocation}</span>
                  </div>
                )}
              </div>

              {/* Price Tag */}
              <div className="text-left md:text-right shrink-0">
                <span className="block text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                  Offered At
                </span>
                <span className="font-serif text-3xl sm:text-4xl font-bold text-zinc-950">
                  {formatCurrency(property.price)}
                </span>
              </div>
            </div>
          </AnimateIn>

          {/* Image Gallery with animation */}
          <AnimateIn direction="up" delay={0.1} className="mb-10">
            <PropertyGallery images={property.images} title={property.title} />
          </AnimateIn>

          {/* Main Grid: Info + Sidebar */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Left 2 Cols: Specs, Description, Location */}
            <div className="lg:col-span-2 space-y-8">
              {/* Key Specs Card */}
              <AnimateIn direction="up" delay={0.15}>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h2 className="font-serif text-lg font-bold text-zinc-900 mb-4">
                    Property Overview & Metrics
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-zinc-100">
                    {property.bedrooms !== null && (
                      <div className="pt-2 sm:pt-0 sm:px-2">
                        <div className="flex items-center justify-center gap-1.5 text-zinc-400 mb-1">
                          <Bed className="h-5 w-5 text-amber-600" />
                        </div>
                        <span className="block font-serif text-2xl font-bold text-zinc-900">
                          {property.bedrooms}
                        </span>
                        <span className="text-xs text-zinc-500">Bedrooms</span>
                      </div>
                    )}

                    {property.bathrooms !== null && (
                      <div className="pt-2 sm:pt-0 sm:px-2">
                        <div className="flex items-center justify-center gap-1.5 text-zinc-400 mb-1">
                          <Bath className="h-5 w-5 text-amber-600" />
                        </div>
                        <span className="block font-serif text-2xl font-bold text-zinc-900">
                          {property.bathrooms}
                        </span>
                        <span className="text-xs text-zinc-500">Bathrooms</span>
                      </div>
                    )}

                    {property.square_feet !== null && (
                      <div className="pt-2 sm:pt-0 sm:px-2">
                        <div className="flex items-center justify-center gap-1.5 text-zinc-400 mb-1">
                          <Square className="h-5 w-5 text-amber-600" />
                        </div>
                        <span className="block font-serif text-2xl font-bold text-zinc-900">
                          {property.square_feet.toLocaleString()}
                        </span>
                        <span className="text-xs text-zinc-500">Square Feet</span>
                      </div>
                    )}

                    <div className="pt-2 sm:pt-0 sm:px-2">
                      <div className="flex items-center justify-center gap-1.5 text-zinc-400 mb-1">
                        <Calendar className="h-5 w-5 text-amber-600" />
                      </div>
                      <span className="block font-serif text-sm font-bold text-zinc-900 mt-1">
                        {new Date(property.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                      <span className="text-xs text-zinc-500">Verified Listing</span>
                    </div>
                  </div>
                </div>
              </AnimateIn>

              {/* Description */}
              {property.description && (
                <AnimateIn direction="up" delay={0.2}>
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <h2 className="font-serif text-xl font-bold text-zinc-950 mb-4">
                      Architectural & Living Description
                    </h2>
                    <div className="prose prose-zinc max-w-none text-zinc-700 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                      {property.description}
                    </div>
                  </div>
                </AnimateIn>
              )}

              {/* Features and Amenities checklist */}
              <AnimateIn direction="up" delay={0.25}>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <h2 className="font-serif text-lg font-bold text-zinc-950 mb-4">
                    Signature Highlights
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-zinc-700">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Prime {formatPropertyType(property.property_type)} Architecture</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Verified Legal & Title Documentation</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Private Viewings by Advance Appointment</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                      <span>Comprehensive Offering Memorandum Available</span>
                    </div>
                  </div>
                </div>
              </AnimateIn>

              {/* Location & Coordinates Presentation */}
              <AnimateIn direction="up" delay={0.3}>
                <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-serif text-lg font-bold text-zinc-950">
                      Location & Geographical Presentation
                    </h2>
                    {hasCoords && (
                      <span className="inline-flex items-center gap-1 text-xs text-amber-700 font-medium">
                        <Navigation className="h-3.5 w-3.5" />
                        <span>GPS Coordinates Verified</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-3 text-sm text-zinc-600">
                    {property.address && (
                      <p>
                        <strong>Street:</strong> {property.address}
                      </p>
                    )}
                    <p>
                      <strong>City & Region:</strong> {[property.city, property.state, property.zip_code].filter(Boolean).join(', ')}
                    </p>
                    {property.country && (
                      <p>
                        <strong>Country:</strong> {property.country}
                      </p>
                    )}

                    {/* Coordinates badge / card */}
                    {hasCoords && (
                      <div className="mt-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <span className="font-mono text-zinc-700">
                            Latitude: {property.latitude} | Longitude: {property.longitude}
                          </span>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-700 hover:underline font-semibold"
                          >
                            View in Google Maps ↗
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </AnimateIn>
            </div>

            {/* Right Column: Agent + Inquiry Form */}
            <div className="space-y-6">
              <AnimateIn direction="up" delay={0.2}>
                {property.agent ? (
                  <AgentCard agent={property.agent} />
                ) : (
                  <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block mb-1">
                      Brokerage Direct
                    </span>
                    <h4 className="font-serif text-base font-bold text-zinc-900">
                      Aura Estates Private Office
                    </h4>
                    <p className="text-xs text-zinc-500 mt-1 leading-relaxed">
                      This residence is managed directly by our senior acquisition partners. Submit your inquiry below for private representation.
                    </p>
                  </div>
                )}
              </AnimateIn>

              {/* Inquiry Form */}
              <AnimateIn direction="up" delay={0.28}>
                <PropertyInquiryForm
                  propertyId={property.id}
                  propertyTitle={property.title}
                />
              </AnimateIn>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
