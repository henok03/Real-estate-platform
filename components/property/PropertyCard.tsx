import Image from 'next/image';
import Link from 'next/link';
import { Bed, Bath, Square, MapPin, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Property } from '@/types';

interface PropertyCardProps {
  property: Property;
  priority?: boolean;
}

export function formatPropertyType(type: string): string {
  switch (type) {
    case 'single_family':
      return 'Single Family';
    case 'apartment':
      return 'Apartment';
    case 'condo':
      return 'Condo';
    case 'townhouse':
      return 'Townhouse';
    case 'villa':
      return 'Villa';
    case 'land':
      return 'Land';
    case 'commercial':
      return 'Commercial';
    case 'office':
      return 'Office';
    default:
      return 'Property';
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function PropertyCard({ property, priority = false }: PropertyCardProps) {
  const imageUrl = property.primary_image || property.images?.[0]?.image_url;
  const locationString = [property.city, property.state, property.country]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-zinc-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      {/* Thumbnail Area */}
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.title}
            fill
            priority={priority}
            referrerPolicy="no-referrer"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center bg-zinc-100 text-zinc-400 p-4 text-center">
            <span className="text-3xl mb-1">🏛️</span>
            <span className="text-xs font-medium text-zinc-500">Image pending verification</span>
          </div>
        )}

        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <Badge className="bg-zinc-950/80 backdrop-blur-sm text-white font-medium border-0">
            {formatPropertyType(property.property_type)}
          </Badge>
          {property.status === 'draft' && (
            <Badge variant="warning">Draft</Badge>
          )}
        </div>

        <div className="absolute bottom-3 right-3">
          <span className="rounded-lg bg-white/95 px-3 py-1 font-serif text-base font-bold text-zinc-950 shadow-md backdrop-blur-sm">
            {formatCurrency(property.price)}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          {/* Location */}
          {locationString && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 mb-2">
              <MapPin className="h-3.5 w-3.5 shrink-0 text-amber-600" />
              <span className="truncate">{locationString}</span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-serif text-lg font-bold text-zinc-950 transition-colors group-hover:text-amber-700 line-clamp-1">
            {property.title}
          </h3>

          {/* Specs: beds, baths, sqft */}
          <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-600">
            {property.bedrooms !== null && (
              <div className="flex items-center gap-1.5">
                <Bed className="h-4 w-4 text-zinc-400" />
                <span>
                  <strong>{property.bedrooms}</strong> Beds
                </span>
              </div>
            )}
            {property.bathrooms !== null && (
              <div className="flex items-center gap-1.5">
                <Bath className="h-4 w-4 text-zinc-400" />
                <span>
                  <strong>{property.bathrooms}</strong> Baths
                </span>
              </div>
            )}
            {property.square_feet !== null && (
              <div className="flex items-center gap-1.5">
                <Square className="h-4 w-4 text-zinc-400" />
                <span>
                  <strong>{property.square_feet.toLocaleString()}</strong> sq ft
                </span>
              </div>
            )}
          </div>
        </div>

        {/* View Details Button */}
        <div className="mt-5 pt-3">
          <Link href={`/properties/${property.id}`} className="block">
      <Button
  variant="outline"
  className="w-full justify-between border-zinc-200 text-zinc-800 bg-white hover:bg-zinc-900 hover:text-white hover:border-zinc-900 group-hover:bg-zinc-900 group-hover:text-white group-hover:border-zinc-900 transition-all duration-200"
>
  <span className="text-current">View Residence Details</span>
  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
