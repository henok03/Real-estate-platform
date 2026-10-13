'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Search, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface PropertySearchFilterProps {
  compact?: boolean;
}

export function PropertySearchFilter({ compact = false }: PropertySearchFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [propertyType, setPropertyType] = useState(searchParams.get('property_type') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('min_price') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('max_price') || '');
  const [bedrooms, setBedrooms] = useState(searchParams.get('bedrooms') || '');
  const [bathrooms, setBathrooms] = useState(searchParams.get('bathrooms') || '');
  const [showAdvanced, setShowAdvanced] = useState(!compact);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (location.trim()) params.set('location', location.trim());
    if (propertyType && propertyType !== 'all') params.set('property_type', propertyType);
    if (minPrice) params.set('min_price', minPrice);
    if (maxPrice) params.set('max_price', maxPrice);
    if (bedrooms) params.set('bedrooms', bedrooms);
    if (bathrooms) params.set('bathrooms', bathrooms);

    router.push(`/properties?${params.toString()}`);
  };

  const handleReset = () => {
    setLocation('');
    setPropertyType('');
    setMinPrice('');
    setMaxPrice('');
    setBedrooms('');
    setBathrooms('');
    router.push('/properties');
  };

  return (
    <div className="w-full rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6 shadow-xl">
      <form onSubmit={handleSearch} className="space-y-4">
        {/* Main Bar */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Location */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Location / City
            </label>
            <div className="relative">
              <Input
                placeholder="e.g. Beverly Hills, London, Miami..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-3"
              />
            </div>
          </div>

          {/* Property Type */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Property Type
            </label>
            <select
              value={propertyType}
              onChange={(e) => setPropertyType(e.target.value)}
              className="flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
            >
              <option value="">All Architectural Types</option>
              <option value="villa">Private Villa</option>
              <option value="single_family">Single Family Home</option>
              <option value="condo">Condominium</option>
              <option value="apartment">Apartment / Penthouse</option>
              <option value="townhouse">Townhouse</option>
              <option value="land">Estate Land</option>
              <option value="commercial">Commercial</option>
              <option value="office">Office Space</option>
              <option value="other">Other Real Estate</option>
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-1">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-600">
              Price Range (USD)
            </label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Min $"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="w-1/2"
                min="0"
                step="50000"
              />
              <span className="text-zinc-400 text-xs">-</span>
              <Input
                type="number"
                placeholder="Max $"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="w-1/2"
                min="0"
                step="50000"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-end gap-2 pt-1">
            <Button
              type="submit"
              className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800 gap-2 h-10 shadow"
            >
              <Search className="h-4 w-4" />
              <span>Search</span>
            </Button>
            {compact && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="h-10 px-3 text-zinc-600"
                title="Toggle Filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-zinc-100">
            <div>
              <label className="text-xs font-medium text-zinc-600 mb-1 block">Minimum Bedrooms</label>
              <select
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900"
              >
                <option value="">Any Bedrooms</option>
                <option value="1">1+ Bedrooms</option>
                <option value="2">2+ Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
                <option value="4">4+ Bedrooms</option>
                <option value="5">5+ Bedrooms</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-zinc-600 mb-1 block">Minimum Bathrooms</label>
              <select
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                className="flex h-9 w-full rounded-lg border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-900"
              >
                <option value="">Any Bathrooms</option>
                <option value="1">1+ Bathrooms</option>
                <option value="2">2+ Bathrooms</option>
                <option value="3">3+ Bathrooms</option>
                <option value="4">4+ Bathrooms</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleReset}
                className="h-9 w-full gap-2 text-xs text-zinc-500 hover:text-zinc-900"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset All Filters</span>
              </Button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
