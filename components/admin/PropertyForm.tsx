'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Save,
  Plus,
  Trash2,
  Star,
  Loader2,
  AlertCircle,
  Building,
  UserPlus,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { savePropertyAction, createAgentAction } from '@/lib/actions';
import type { Property, Agent, PropertyType, PropertyStatus } from '@/types';

interface PropertyFormProps {
  initialProperty?: Property;
  agents: Agent[];
}

interface ImageItem {
  id?: string;
  image_url: string;
  is_primary: boolean;
  sort_order: number;
}

export function PropertyForm({ initialProperty, agents: initialAgents }: PropertyFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // Form fields
  const [title, setTitle] = useState(initialProperty?.title || '');
  const [description, setDescription] = useState(initialProperty?.description || '');
  const [price, setPrice] = useState(initialProperty?.price?.toString() || '');
  const [propertyType, setPropertyType] = useState<PropertyType>(
    initialProperty?.property_type || 'single_family'
  );
  const [status, setStatus] = useState<PropertyStatus>(initialProperty?.status || 'published');
  const [bedrooms, setBedrooms] = useState(initialProperty?.bedrooms?.toString() || '');
  const [bathrooms, setBathrooms] = useState(initialProperty?.bathrooms?.toString() || '');
  const [squareFeet, setSquareFeet] = useState(initialProperty?.square_feet?.toString() || '');
  const [address, setAddress] = useState(initialProperty?.address || '');
  const [city, setCity] = useState(initialProperty?.city || '');
  const [state, setState] = useState(initialProperty?.state || '');
  const [country, setCountry] = useState(initialProperty?.country || 'United States');
  const [zipCode, setZipCode] = useState(initialProperty?.zip_code || '');
  const [latitude, setLatitude] = useState(initialProperty?.latitude?.toString() || '');
  const [longitude, setLongitude] = useState(initialProperty?.longitude?.toString() || '');
  const [agentId, setAgentId] = useState<string>(initialProperty?.agent_id?.toString() || '');

  // Images state
  const [images, setImages] = useState<ImageItem[]>(
    initialProperty?.images?.map((img, idx) => ({
      id: img.id,
      image_url: img.image_url,
      is_primary: img.is_primary,
      sort_order: img.sort_order ?? idx,
    })) || []
  );
  const [newImageUrl, setNewImageUrl] = useState('');

  // Agents & Quick Agent creation
  const [agentsList, setAgentsList] = useState<Agent[]>(initialAgents);
  const [showAgentModal, setShowAgentModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentEmail, setNewAgentEmail] = useState('');
  const [newAgentPhone, setNewAgentPhone] = useState('');
  const [agentCreating, setAgentCreating] = useState(false);

  const handleAddImage = () => {
    if (!newImageUrl.trim()) return;
    const isFirst = images.length === 0;
    setImages([
      ...images,
      {
        image_url: newImageUrl.trim(),
        is_primary: isFirst,
        sort_order: images.length,
      },
    ]);
    setNewImageUrl('');
  };

  const handleSetPrimary = (index: number) => {
    setImages(
      images.map((img, i) => ({
        ...img,
        is_primary: i === index,
      }))
    );
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    if (images[index].is_primary && updated.length > 0) {
      updated[0].is_primary = true;
    }
    setImages(updated);
  };

  const handleQuickAddAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName.trim()) return;
    setAgentCreating(true);
    try {
      const res = await createAgentAction({
        name: newAgentName.trim(),
        email: newAgentEmail.trim() || undefined,
        phone: newAgentPhone.trim() || undefined,
      });
      if (res?.agent) {
        setAgentsList([...agentsList, res.agent]);
        setAgentId(String(res.agent.id));
        setShowAgentModal(false);
        setNewAgentName('');
        setNewAgentEmail('');
        setNewAgentPhone('');
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Failed to create agent');
    } finally {
      setAgentCreating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice <= 0) {
      setError('Please provide a valid price greater than 0.');
      return;
    }

    if (!title.trim()) {
      setError('Property title is required.');
      return;
    }

    startTransition(async () => {
      try {
        await savePropertyAction({
          id: initialProperty?.id,
          title: title.trim(),
          description: description.trim(),
          price: numPrice,
          property_type: propertyType,
          status,
          bedrooms: bedrooms ? parseInt(bedrooms, 10) : null,
          bathrooms: bathrooms ? parseFloat(bathrooms) : null,
          square_feet: squareFeet ? parseInt(squareFeet, 10) : null,
          address: address.trim(),
          city: city.trim(),
          state: state.trim(),
          country: country.trim(),
          zip_code: zipCode.trim(),
          latitude: latitude ? parseFloat(latitude) : null,
          longitude: longitude ? parseFloat(longitude) : null,
          agent_id: agentId && agentId.trim() !== '' ? agentId.trim() : null,
          images: images.map((img, idx) => ({
            image_url: img.image_url,
            is_primary: img.is_primary,
            sort_order: idx,
          })),
        });

        router.push('/admin/properties');
        router.refresh();
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Failed to save property');
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/admin/properties">
            <Button variant="outline" size="icon" className="h-9 w-9">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-zinc-950">
              {initialProperty ? 'Edit Residence' : 'Add New Residence'}
            </h1>
            <p className="text-xs text-zinc-500">
              {initialProperty
                ? `Updating ID #${initialProperty.id} - ${initialProperty.title}`
                : 'Create and publish a verified property to the Neon database'}
            </p>
          </div>
        </div>

        <Button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 shadow"
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          <span>{initialProperty ? 'Save Changes' : 'Create Residence'}</span>
        </Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl bg-rose-50 border border-rose-200 p-4 text-sm text-rose-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Core Details Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-5">
          <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3 flex items-center gap-2">
            <Building className="h-5 w-5 text-amber-600" />
            <span>Essential Specifications</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="prop-title" required>
                Property Title
              </Label>
              <Input
                id="prop-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. The Bel-Air Crown Estate & Panoramic Villa"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-price" required>
                Price (USD)
              </Label>
              <Input
                id="prop-price"
                type="number"
                min="0"
                step="1000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 4500000"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-type" required>
                Property Type
              </Label>
              <select
                id="prop-type"
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value as PropertyType)}
                className="mt-1 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
              >
                <option value="single_family">Single Family Home</option>
                <option value="villa">Private Villa</option>
                <option value="condo">Condominium</option>
                <option value="apartment">Apartment / Penthouse</option>
                <option value="townhouse">Townhouse</option>
                <option value="land">Land</option>
                <option value="commercial">Commercial</option>
                <option value="office">Office</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <Label htmlFor="prop-status" required>
                Listing Status
              </Label>
              <select
                id="prop-status"
                value={status}
                onChange={(e) => setStatus(e.target.value as PropertyStatus)}
                className="mt-1 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
              >
                <option value="published">Published (Visible publicly)</option>
                <option value="draft">Draft (Admin eyes only)</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="prop-agent">Assigned Broker / Agent</Label>
                <button
                  type="button"
                  onClick={() => setShowAgentModal(true)}
                  className="text-xs text-amber-600 hover:underline flex items-center gap-1"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>+ Quick Add Agent</span>
                </button>
              </div>
              <select
                id="prop-agent"
                value={agentId}
                onChange={(e) => setAgentId(e.target.value)}
                className="mt-1 flex h-10 w-full rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm text-zinc-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-950"
              >
                <option value="">No Agent Assigned (Brokerage Direct)</option>
                {agentsList.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name} {agent.email ? `(${agent.email})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="prop-beds">Bedrooms</Label>
              <Input
                id="prop-beds"
                type="number"
                min="0"
                value={bedrooms}
                onChange={(e) => setBedrooms(e.target.value)}
                placeholder="e.g. 5"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-baths">Bathrooms</Label>
              <Input
                id="prop-baths"
                type="number"
                min="0"
                step="0.5"
                value={bathrooms}
                onChange={(e) => setBathrooms(e.target.value)}
                placeholder="e.g. 6.5"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-sqft">Square Feet</Label>
              <Input
                id="prop-sqft"
                type="number"
                min="0"
                value={squareFeet}
                onChange={(e) => setSquareFeet(e.target.value)}
                placeholder="e.g. 7800"
                className="mt-1"
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="prop-desc">Full Architectural Description</Label>
              <Textarea
                id="prop-desc"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the craftsmanship, views, custom Italian finishes, wine cellar, infinity pool..."
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Location Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-serif text-lg font-bold text-zinc-900 border-b border-zinc-100 pb-3">
            Location & Coordinates
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-3">
              <Label htmlFor="prop-address">Street Address</Label>
              <Input
                id="prop-address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. 10240 Sunset Boulevard"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-city">City</Label>
              <Input
                id="prop-city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="e.g. Los Angeles"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-state">State / Province</Label>
              <Input
                id="prop-state"
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="e.g. CA"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-zip">ZIP / Postal Code</Label>
              <Input
                id="prop-zip"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                placeholder="e.g. 90077"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-country">Country</Label>
              <Input
                id="prop-country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="e.g. United States"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-lat">Latitude (Optional)</Label>
              <Input
                id="prop-lat"
                type="number"
                step="any"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                placeholder="e.g. 34.0837"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="prop-lng">Longitude (Optional)</Label>
              <Input
                id="prop-lng"
                type="number"
                step="any"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                placeholder="e.g. -118.4358"
                className="mt-1"
              />
            </div>
          </div>
        </div>

        {/* Property Images Card */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-zinc-100 pb-3 gap-2">
            <div>
              <h2 className="font-serif text-lg font-bold text-zinc-900">High-Resolution Photography</h2>
              <p className="text-xs text-zinc-500">
                Enter image URLs. Stored in <code className="text-amber-700">property_images</code> table.
              </p>
            </div>
            <span className="text-xs font-semibold text-zinc-500">
              {images.length} {images.length === 1 ? 'image' : 'images'} added
            </span>
          </div>

          {/* Add Image URL bar */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Paste image URL (e.g. Unsplash, CDN, or Cloudinary URL)..."
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddImage();
                }
              }}
              className="flex-1"
            />
            <Button
              type="button"
              onClick={handleAddImage}
              variant="outline"
              className="gap-2 shrink-0 border-zinc-300"
            >
              <Plus className="h-4 w-4" />
              <span>Add Image</span>
            </Button>
          </div>

          {/* Suggestion tip */}
          <p className="text-[11px] text-zinc-400">
            Tip: You can use free high-res architectural photos from Unsplash (e.g.{' '}
            <code className="text-zinc-600">
              https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600
            </code>
            )
          </p>

          {/* Image List */}
          {images.length === 0 ? (
            <div className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-xs text-zinc-400">
              No images added yet. Add at least one image URL to present this property.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
              {images.map((img, idx) => (
                <div
                  key={idx}
                  className={`group relative overflow-hidden rounded-xl border p-2 bg-zinc-50 transition-all ${
                    img.is_primary ? 'border-amber-600 ring-2 ring-amber-500/20' : 'border-zinc-200'
                  }`}
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg bg-zinc-200">
                    <Image
                      src={img.image_url}
                      alt={`Preview ${idx + 1}`}
                      fill
                      referrerPolicy="no-referrer"
                      className="object-cover"
                    />
                  </div>

                  <div className="mt-2 flex items-center justify-between gap-2 text-xs">
                    <button
                      type="button"
                      onClick={() => handleSetPrimary(idx)}
                      className={`flex items-center gap-1 rounded-md px-2 py-1 font-medium transition-colors ${
                        img.is_primary
                          ? 'bg-amber-600 text-white'
                          : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
                      }`}
                    >
                      <Star className={`h-3 w-3 ${img.is_primary ? 'fill-white' : ''}`} />
                      <span>{img.is_primary ? 'Primary Image' : 'Make Primary'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRemoveImage(idx)}
                      className="rounded-md p-1 text-zinc-400 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      title="Remove image"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-200">
          <Link href="/admin/properties">
            <Button variant="outline" type="button">
              Cancel
            </Button>
          </Link>
          <Button
            type="submit"
            disabled={isPending}
            className="bg-zinc-900 text-white hover:bg-zinc-800 gap-2 px-8 h-11 shadow"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            <span>{initialProperty ? 'Update Property' : 'Save & Publish Property'}</span>
          </Button>
        </div>
      </form>

      {/* Quick Add Agent Modal */}
      {showAgentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="font-serif text-lg font-bold text-zinc-900 mb-1">Add Real Estate Agent</h3>
            <p className="text-xs text-zinc-500 mb-4">
              Create an agent in the <code className="text-amber-700">agents</code> table to associate with this property.
            </p>

            <form onSubmit={handleQuickAddAgent} className="space-y-3">
              <div>
                <Label htmlFor="agent-name" required>
                  Agent Full Name
                </Label>
                <Input
                  id="agent-name"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g. Julian Montgomery"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="agent-email">Email Address</Label>
                <Input
                  id="agent-email"
                  type="email"
                  value={newAgentEmail}
                  onChange={(e) => setNewAgentEmail(e.target.value)}
                  placeholder="julian@auraestates.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="agent-phone">Direct Phone</Label>
                <Input
                  id="agent-phone"
                  value={newAgentPhone}
                  onChange={(e) => setNewAgentPhone(e.target.value)}
                  placeholder="+1 (310) 555-0199"
                  className="mt-1"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-zinc-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAgentModal(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={agentCreating}
                  className="bg-zinc-900 text-white hover:bg-zinc-800"
                >
                  {agentCreating ? 'Saving...' : 'Add Agent'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
